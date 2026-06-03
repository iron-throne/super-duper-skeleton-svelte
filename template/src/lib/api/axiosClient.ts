// src/lib/api/axiosConfig.ts
// Configured axios instance used for all API requests.
// Sets the base URL from the PUBLIC_API_BASE_URL env variable and injects
// the JWT Bearer token automatically on every outgoing request.

import axios from "axios";
import { API_TIMEOUT } from "./types/common";
import { env } from "$env/dynamic/public";
import { snackStore } from "$lib/stores/snackbar.svelte";
import { getItem, removeItem } from "$lib/utils/storage";
import { EStorageKey } from "$lib/types";

/** Single shared axios instance — import this instead of creating new instances. */
export const axiosConfig = axios.create({
  baseURL: env.PUBLIC_API_URL,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// In-memory token mirror — avoids hitting localStorage on every request.
let _token: string | null = null;

/** Call this from the auth store after login/logout to keep the token in sync. */
export async function setAuthToken(token: string | null) {
  _token = token;
  const controller = await waitForServiceWorkerController();
  controller.postMessage({
    type: "SET_AUTH_TOKEN",
    token
  });
}

async function waitForServiceWorkerController(): Promise<ServiceWorker> {
  // If already controlling, return immediately
  if (navigator.serviceWorker.controller) {
    return navigator.serviceWorker.controller;
  }

  // Otherwise wait for controllerchange
  return new Promise((resolve) => {
    const listener = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener("controllerchange", listener);
        resolve(navigator.serviceWorker.controller);
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", listener);
  });
}

// Attach Bearer token on every request.
// Prefers the in-memory token; falls back to localStorage if restoreSession hasn't run yet.
// This covers the edge case where an API call fires before hooks.client.ts has synced the store.
axiosConfig.interceptors.request.use((config) => {
  let token = _token;
  if (!token && typeof localStorage !== 'undefined') {
    const raw = getItem(EStorageKey.AUTH_USER);
    token = raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
  }
  if (token) {
    config.headers['kuki'] = token;
  }
  return config;
});

// Pass through successful responses unchanged; show a snack on 401, then re-throw.
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      snackStore.error("Unauthorized. Please log in again.", 5000);
      removeItem(EStorageKey.AUTH_USER); // clear any user token on 401 — forces a logout and prevents future 401s until the user logs in again.
    }
    return Promise.reject(error);
  },
);
