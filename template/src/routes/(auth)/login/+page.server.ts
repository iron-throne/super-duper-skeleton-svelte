import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '$lib/constants';
import { DASHBOARD_ROUTE } from '$lib/constants/pageRoutes';
import { env } from '$env/dynamic/public';
import type { AuthToken, IAuthUser } from '$lib/api/types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const form = await request.formData();
        const email = String(form.get('email') ?? '').trim();
        const password = String(form.get('password') ?? '');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required.' });
        }

        // ── 1. Exchange credentials for tokens ────────────────────
        let token: AuthToken;
        try {
            const res = await fetch(`${env.PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401 || res.status === 403) {
                return fail(401, { error: 'Invalid email or password.' });
            }
            if (!res.ok) {
                return fail(res.status, { error: 'Login failed. Please try again.' });
            }

            token = await res.json() as AuthToken;
        } catch {
            return fail(503, { error: 'Cannot reach the server. Please try again later.' });
        }

        // ── 2. Fetch the user's profile ───────────────────────────
        let user: IAuthUser;
        try {
            const meRes = await fetch(`${env.PUBLIC_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token.accessToken}` },
            });
            user = await meRes.json() as IAuthUser;
        } catch {
            return fail(503, { error: 'Could not load user profile. Please try again.' });
        }

        // ── 3. Write the session cookie ───────────────────────────
        const session = {
            user,
            accessToken: token.accessToken,
            expiresAt: Date.now() + token.expiresIn * 1000,
        };

        cookies.set(AUTH_COOKIE_NAME, btoa(JSON.stringify(session)), {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: token.expiresIn,
            sameSite: 'lax',
        });

        throw redirect(303, DASHBOARD_ROUTE);
    },
};
