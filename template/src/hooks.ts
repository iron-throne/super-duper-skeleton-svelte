import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;
// If you export a function named reroute, SvelteKit will automatically run it on every request before routing.
// Rerouting helper for Paraglide i18n.
// This removes the locale prefix from the URL (e.g. /en/about → /about)
// so SvelteKit always receives a clean, non‑localized path.
// Paraglide adds this to ensure routing works normally even when URLs contain language codes.


// 1. handle - Runs before every request; used for middleware logic like auth, i18n, headers, etc.
// 2. reroute - Runs before routing; lets you rewrite URLs (e.g., remove /en from /en/about).
// 3. handleFetch - Runs on every fetch() call; lets you modify outgoing requests (add tokens, headers).
// 4. handleError - Runs whenever an error occurs; used for logging or sending errors to monitoring tools.