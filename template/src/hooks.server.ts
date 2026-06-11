// src/hooks.server.ts
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getTextDirection } from '$lib/paraglide/runtime';
import { sequence } from '@sveltejs/kit/hooks';
import { AUTH_COOKIE_NAME } from '$shared/config';
import { env } from '$env/dynamic/private';

/* Paraglide: inject locale + direction into HTML */
const handleParaglide: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request, locale }) => {
        event.request = request;
        return resolve(event, {
            transformPageChunk: ({ html }) =>
                html
                    .replace('%paraglide.lang%', locale)
                    .replace('%paraglide.dir%', getTextDirection(locale))
        });
    });

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
export const handle = sequence(handleParaglide, authHandle);

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


// import { redirect } from '@sveltejs/kit';

// export function handle({ event, resolve }) {
//   // Force all routes to lowercase so routing becomes case‑insensitive
//   const lower = event.url.pathname.toLowerCase();

//   if (event.url.pathname !== lower) {
//     return redirect(301, lower + event.url.search);
//   }

//   return resolve(event);
// }
