// Universal hooks — runs on both server and client before every request.
// Currently empty; add reroute() here if you need URL rewriting (e.g. locale prefixes).

// 1. handle       — Runs before every request; middleware for auth, i18n, headers, etc.
// 2. reroute      — Runs before routing; lets you rewrite URLs (e.g., /en/about → /about).
// 3. handleFetch  — Runs on every server-side fetch(); modify outgoing requests (add tokens).
// 4. handleError  — Runs when an error occurs; used for logging or error monitoring.
