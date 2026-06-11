// Configured axios instance — import httpClient instead of creating new instances.
// Intentionally has NO UI imports (no snackStore). UI side-effects belong in the
// entity service layer, not in transport infrastructure.

import axios from 'axios';
import { env } from '$env/dynamic/public';
import { getItem, removeItem } from '@aryagg/utils';
import { EStorageKey } from '@aryagg/types';
import { API_TIMEOUT } from './types';

let _token: string | null = null;

/** Call this from the auth entity after login/logout to keep the in-memory token in sync. */
export function setAuthToken(token: string | null) {
	_token = token;
}

export const httpClient = axios.create({
	baseURL: env.PUBLIC_API_URL,
	timeout: API_TIMEOUT,
	headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every request.
// Prefers the in-memory mirror; falls back to localStorage for the edge case where
// an API call fires before the auth entity has synced the store (e.g. page reload).
httpClient.interceptors.request.use((config) => {
	let token = _token;
	if (!token && typeof localStorage !== 'undefined') {
		const raw = getItem(EStorageKey.AUTH_USER);
		token = raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
	}
	if (token) config.headers['kuki'] = token;
	return config;
});

// On 401: clear stale credentials silently.
// The entity service layer decides whether to show a toast.
httpClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			removeItem(EStorageKey.AUTH_USER);
		}
		return Promise.reject(error);
	},
);
