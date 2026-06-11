import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME, LOGIN_ROUTE } from '$shared/config';

export const actions: Actions = {
    default: async ({ cookies }) => {
        cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
        throw redirect(302, LOGIN_ROUTE);
    }
};

// GET /logout — also works for simple <a href="/logout"> links
export async function load({ cookies }) {
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    throw redirect(302, LOGIN_ROUTE);
}
