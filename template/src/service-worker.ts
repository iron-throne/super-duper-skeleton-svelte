/// <reference lib="webworker" />

import { openDB } from "idb";
import { build, files, version } from "$service-worker";

declare const self: ServiceWorkerGlobalScope;

// 3 separate caches — each with a different lifecycle:
// STATIC_CACHE  → SvelteKit build chunks + /static files, NEVER cleared (versioned)
// DYNAMIC_CACHE → API responses + page HTML, cleared on logout
const STATIC_CACHE = `static-${version}`;  // new name on every deploy = auto cleanup
const DYNAMIC_CACHE = `dynamic-${version}`; // new name on every deploy = auto cleanup
const URL_PARAM_CACHE = "sw-cache"; // query param to signal whether a request should be cached by the SW

// SvelteKit populates these at build time:
// build → hashed JS/CSS chunks  e.g. /_app/immutable/entry/start.abc123.js
// files → everything in /static  e.g. /favicon.png, /robots.txt
const ASSETS = [...build, ...files];
const ASSETS_SET = new Set(ASSETS); // O(1) lookup vs O(n) array scan on every fetch

// IndexedDB queue for replaying requests made while offline
const DB_NAME = "offline-db";
const STORE_NAME = "request-queue";

// How many times to retry a queued request before giving up
const MAX_RETRIES = 5;
// TTL — how long a dynamic cache entry is considered "fresh"
// After this duration, the cached response is deleted and fresh data is fetched
// STATIC_CACHE is exempt — those files are content-hashed so they never go stale
const DYNAMIC_TTL_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

let isProcessingQueue = false; // flag to prevent concurrent queue processing
let authToken = ""; // in-memory token mirror to avoid hitting localStorage on every request

// ===============================
// INSTALL — pre-cache all static assets
// ===============================
self.addEventListener("install", (event: ExtendableEvent) => {
    console.log("[SW] Install — caching static assets");

    event.waitUntil(
        (async () => {
            const cache = await caches.open(STATIC_CACHE);
            // cache.addAll() fails entirely if one asset 404s — cache individually instead
            await Promise.allSettled(
                ASSETS.map((asset) =>
                    cache.add(asset).catch((err) => {
                        console.warn("[SW] Failed to cache asset:", asset, err);
                    })
                )
            );
            console.log("[SW] Installed — static assets cached:", ASSETS.length);
        })()
    );

    // Don't wait for old SW to die — take over immediately
    self.skipWaiting();
});


// ===============================
// ACTIVATE — delete stale versioned caches
// ===============================
self.addEventListener("activate", (event: ExtendableEvent) => {
    console.log("[SW] Activate — cleaning old caches");

    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys.map((key) => {
                    // Anything that isn't a current cache name gets deleted
                    // This handles old static-v1, dynamic-v1 etc automatically
                    const keep =
                        key === STATIC_CACHE ||
                        key === DYNAMIC_CACHE;

                    return keep ? null : caches.delete(key);
                })
            );

            await self.clients.claim(); // take control of all open tabs now
            console.log("[SW] Activated — stale caches removed");
        })()
    );
});


// ===============================
// FETCH — main request router
// ===============================
self.addEventListener("fetch", (event: FetchEvent) => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event: FetchEvent): Promise<Response> {
    const { request } = event;
    const url = new URL(request.url);

    // Ignore non-HTTP requests (chrome-extension://, data:, blob:, etc.)
    if (!url.protocol.startsWith("http")) {
        return fetch(request);
    }

    if (url.searchParams.get(URL_PARAM_CACHE) === "false") {
        return fetch(request);
    }

    // Route 2 → static assets: JS, CSS, fonts, images (cache-first, never evicted)
    const asset = await handleAssets(request, event);
    if (asset) return asset;

    // Route 3 → everything else: API calls, page navigations (network-first)
    return handleApiAndPages(request, event);
}

// ===============================
// ROUTE 2 — Static assets (Cache-First)
// These never change between requests (content-hashed filenames)
// so we serve from cache and skip the network entirely
// No TTL — content-hashed files are fresh by definition
// ===============================
async function handleAssets(
    request: Request,
    event: FetchEvent
): Promise<Response | null> {
    const url = new URL(request.url);

    // Only intercept files we know about — let everything else fall through
    if (!ASSETS_SET.has(url.pathname)) return null;

    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);

    // Cache hit → instant response, no network, no TTL check needed
    // (content-hashed filenames change when content changes — never stale)
    if (cached) return cached;

    // Cache miss → fetch and store (only happens if install failed for this file)
    const response = await safeFetch(request);
    if (response?.ok) {
        event.waitUntil(safePut(STATIC_CACHE, request, response.clone()));
        return response;
    }

    // Network also failed — return 503 rather than null so caller doesn't retry needlessly
    return new Response("Asset unavailable offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
    });
}


// ===============================
// ROUTE 3 — API + Pages (Network-First)
// Try network first for fresh data.
// Fall back to cache if offline — but only if cache entry is not expired (TTL).
// No size limit — cache is cleared on logout instead.
// ===============================
async function handleApiAndPages(
    request: Request,
    event: FetchEvent
): Promise<Response> {
    // Never cache page navigations — SvelteKit needs fresh server-rendered HTML
    if (request.mode === "navigate") {
        const response = await safeFetch(request);
        return (
            response ??
            new Response("Network error — please check your connection", {
                status: 503,
                headers: { "Content-Type": "text/plain" }
            })
        );
    }

    const cache = await caches.open(DYNAMIC_CACHE);
    // For POST/PUT requests with ?sw-cache=true, build a stable GET-style cache key
    // so the same endpoint with different bodies gets separate cache entries
    const { cacheRequest } = await buildCacheKey(request);

    // Always try network first — we want fresh data when online
    const response = await safeFetch(request);

    if (response) {
        if (response.ok) {
            // Tag response with current timestamp so TTL can check age later
            // then store in cache for offline fallback
            const tagged = tagWithTimestamp(response.clone());

            if (request.method === "GET") {
                // safePut handles QuotaExceededError — won't crash if disk is full
                event.waitUntil(safePut(DYNAMIC_CACHE, request, tagged));
            } else if (cacheRequest) {
                event.waitUntil(safePut(DYNAMIC_CACHE, cacheRequest, tagged));
            }
        }

        return response; // always return the live network response when available
    }

    // Network failed (offline) → check cache
    const cachedResponse = await cache.match(cacheRequest || request);

    if (cachedResponse) {
        // TTL check — don't serve stale data as if it were current
        const isExpired = isCacheExpired(cachedResponse, DYNAMIC_TTL_MS);

        if (isExpired) {
            // Delete the stale entry — no point keeping expired data
            await cache.delete(cacheRequest || request);
            console.warn("[SW] Cached response expired:", request.url);
        } else {
            console.warn("[SW] Offline — serving from cache:", request.url);
            return cachedResponse; // fresh enough — serve it
        }
    }

    return new Response("Network error — please check your connection", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
    });
}

// ===============================
// MESSAGE HANDLER
// Receives commands from the app via postMessage()
// ===============================
self.addEventListener("message", (event: ExtendableMessageEvent) => {

    const type = event.data?.type;

    if (type === "SET_AUTH_TOKEN") {
        authToken = event.data.token;
        console.log("[SW] Auth token updated via message");
    }

    // Triggered by Background Sync fallback (Safari/Firefox)
    // Call from app when navigator.onLine becomes true
    if (type === "PROCESS_QUEUE") {
        console.log("[SW] Received PROCESS_QUEUE message from app");
        event.waitUntil(processQueue());
    }

    // Triggered on logout — clears all user-specific cached data
    // Call from app: navigator.serviceWorker.controller?.postMessage({ type: "CLEAR_USER_CACHE" })
    // STATIC_CACHE is intentionally kept — it's build assets, not user data
    if (type === "CLEAR_USER_CACHE") {
        event.waitUntil(
            Promise.all([
                caches.delete(DYNAMIC_CACHE), // API responses + pages
                clearQueue(),
            ]).then(() => {
                console.log("[SW] User cache cleared on logout");
            })
        );
    }
});


// ===============================
// BACKGROUND SYNC (Chrome / Edge only)
// Browser calls this automatically when connection is restored
// For Safari/Firefox, the app must postMessage PROCESS_QUEUE manually
// ===============================
self.addEventListener("sync", (event: any) => {
    if (event.tag === "sync-queue") {
        console.log("[SW] Sync event — processing queue");
        event.waitUntil(processQueue());
    }
});

// ===============================
// PROCESS SYNC QUEUE
// ===============================
async function processQueue() {
    if (isProcessingQueue) return; // prevent concurrent runs
    isProcessingQueue = true;

    try {
        const db = await openDB(DB_NAME, 1);

        // Read all queued requests in one short-lived transaction, then close it
        // before doing any async fetch() calls — prevents tx from auto-closing mid-loop
        const requests = await db.getAll(STORE_NAME);

        for (const req of requests) {
            const { url, method, data, headers, id, isFormData } = req;
            try {
                const rebuiltBody = rebuildRequestBody(data, isFormData);
                const rebuiltHeaders = new Headers(headers ?? {});

                // Always override with latest token
                if (authToken) {
                    rebuiltHeaders.set("kuki", authToken);
                }

                rebuiltHeaders.delete("Content-Type"); // ← MUST delete, browser will add boundary automatically
                // For FormData: leave Content-Type absent — fetch sets it with correct boundary
                if (!isFormData && rebuiltBody != null && !rebuiltHeaders.has("Content-Type")) {
                    rebuiltHeaders.set("Content-Type", "application/json");
                }
                console.log("[SW] Syncing queued request:", url, method, "Body:", rebuiltBody, rebuiltBody instanceof FormData, "Headers:", Object.fromEntries(rebuiltHeaders.entries()));
                const response = await fetch(url, {
                    method,
                    headers: rebuiltHeaders,
                    body: rebuiltBody,
                });


                if (!response.ok) {
                    throw new Error(`Queued request failed with status ${response.status}`);
                }

                console.log("[SW] Syncing queued request:", url, "Response:", response);

                if (response.ok) {
                    await db.delete(STORE_NAME, id);
                    console.log("[SW] Synced queued request:", url);
                }
            } catch (err) {
                const retries = (req.retries || 0) + 1;

                if (retries >= MAX_RETRIES) {
                    await db.delete(STORE_NAME, id);
                    console.error("[SW] Dropping after max retries:", url);
                } else {
                    req.retries = retries;
                    await db.put(STORE_NAME, req);
                }
            }
        }
    } catch (err) {
        console.error("[SW] Failed to process queue:", err);
    } finally {
        isProcessingQueue = false;
    }
}

// ===============================
// UTIL — Tag response with current timestamp
// Adds a custom "sw-cached-at" header so TTL can check age later
// We clone headers because Response headers are immutable by default
// ===============================
function tagWithTimestamp(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set("sw-cached-at", Date.now().toString()); // milliseconds since epoch

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

// ===============================
// UTIL — Check if a cached response has expired (TTL)
// Reads the "sw-cached-at" header we set in tagWithTimestamp()
// Returns true if expired, false if still fresh
// ===============================
function isCacheExpired(response: Response, ttlMs: number): boolean {
    const cachedAt = response.headers.get("sw-cached-at");

    // No timestamp means it was cached before we added TTL support
    // Treat as expired so it gets refreshed with a proper timestamp
    if (!cachedAt) return true;

    const age = Date.now() - Number(cachedAt);
    return age > ttlMs; // true = expired, false = still fresh
}


// ===============================
// UTIL — Safe cache.put() with QuotaExceededError handling
// Problem: if the browser disk is full, cache.put() throws QuotaExceededError
//          and caching silently stops working forever
// Solution: catch the error, delete DYNAMIC_CACHE to free space, recover gracefully
// STATIC_CACHE is never purged — build assets must survive quota errors
// ===============================
async function safePut(cacheName: string, request: Request, response: Response) {
    try {
        const cache = await caches.open(cacheName);
        await cache.put(request, response);
    } catch (err: any) {
        if (err?.name === "QuotaExceededError") {
            console.warn("[SW] Quota exceeded — purging dynamic cache to recover");

            // Only purge dynamic data — never nuke static assets
            await caches.delete(DYNAMIC_CACHE);

            // Retry the put into a fresh empty cache
            // If this also fails, we just skip caching — better than crashing
            try {
                const freshCache = await caches.open(cacheName);
                await freshCache.put(request, response);
            } catch {
                console.error("[SW] Cache put failed even after purge — skipping");
            }
        }
    }
}


// ===============================
// UTIL — Build stable cache key for non-GET requests
// POST /api/search?sw-cache=true with body {q:"hello"} →
// GET  /api/search__<sha256-of-body>  (stored as a GET in cache)
// ===============================
async function buildCacheKey(request: Request): Promise<{ cacheRequest: Request | null }> {
    const url = new URL(request.url);
    const isCacheable =
        request.method !== "GET" && url.searchParams.get(URL_PARAM_CACHE) === "true";

    if (!isCacheable) return { cacheRequest: null };

    const bodyText = await request.clone().text();
    const hash = await hashText(bodyText);
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname += `__${hash}`;

    return {
        cacheRequest: new Request(cacheUrl.toString(), {
            method: "GET",
            headers: request.headers
        })
    };
}

// ===============================
// UTIL — safe fetch (treat hard failures as offline)
// ===============================
async function safeFetch(request: Request): Promise<Response | null> {
    try {
        const res = await fetch(request);

        // If backend returns 503, treat as "unavailable" so cache can be used
        if (res.status === 503) return null;

        return res;
    } catch {
        return null;
    }
}

// ===============================
// UTIL — SHA-256 hash → hex string
// ===============================
async function hashText(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const buffer = await crypto.subtle.digest("SHA-256", data);

    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function rebuildFormData(data: any): any {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === "object" && (value as any).__file) {
            formData.append(key, (value as any).data);
        } else {
            formData.append(key, String(value));
        }
    }
    return formData;
}

function rebuildRequestBody(data: any, isFormData: boolean) {
    if (data == null) return undefined;
    if (isFormData) return rebuildFormData(data);
    if (typeof data === "string") return data;
    return JSON.stringify(data);
}

async function clearQueue() {
    const db = await openDB(DB_NAME, 1);
    await db.clear(STORE_NAME);
}
