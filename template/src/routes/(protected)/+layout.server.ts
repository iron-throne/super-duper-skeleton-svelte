import { redirect } from '@sveltejs/kit';
import { LOGIN_ROUTE } from '$lib/constants/pageRoutes.js';

export async function load({ locals }) {
    if (!locals.isAuthenticated || !locals.user) {
        throw redirect(303, LOGIN_ROUTE);
    }

    return { user: locals.user };
}
