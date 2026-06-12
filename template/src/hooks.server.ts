// src/hooks.server.ts
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AUTH_COOKIE_NAME } from '$shared/config';
import { env } from '$env/dynamic/private';

const SUPPORTED_LOCALES = new Set(['en', 'ar', 'es']);
const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

// Server-side locale detection: sets <html lang> and <html dir> on the initial HTML
// render so the browser gets the right text direction before any JS runs.
// This is only a best-guess fallback — the real locale lives in localStorage and
// is applied on the client by initLocale() (see src/lib/shared/i18n/index.ts).
// Without this, RTL users would see a brief LTR flash on first load.
// const handleI18n: Handle = ({ event, resolve }) => {
//     const header = event.request.headers.get('accept-language')?.split(',')[0]?.split('-')[0];
//     const detected = (header && SUPPORTED_LOCALES.has(header) ? header : null) ?? 'en';

//     return resolve(event, {
//         transformPageChunk: ({ html }) =>
//             html
//                 .replace('%lang%', detected)
//                 .replace('%dir%', RTL_LOCALES.has(detected) ? 'rtl' : 'ltr'),
//     });
// };

/* Auth: block access if no session cookie */
const authHandle: Handle = async ({ event, resolve }) => {
   const sessionCookie = event.cookies.get(AUTH_COOKIE_NAME);
   if(sessionCookie) {
    try {
        const session = JSON.parse(atob(sessionCookie));
        if(session?.user) {
            event.locals.user = session.user;
            event.locals.isAuthenticated = true;
        }

    } catch(err) {
        console.error(err);
        event.cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    }
   } else {
    event.locals.user = null;
    event.locals.isAuthenticated = false;
   }
   return resolve(event);
};

/* Combine middleware in order */
export const handle = sequence(authHandle);

/* Add headers to all server-side fetch calls, runs before every server‑side fetch */
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
    request.headers.set('X-API-Key', env.API_KEY ?? '');
    return fetch(request);
};

/* Log all server errors */
export const handleError: HandleServerError = ({ error, event }) => {
    console.error('🔥 SERVER ERROR:', error, 'URL:', event.url.pathname);

    return {
        message: 'Something went wrong on the server.'
    };
};
