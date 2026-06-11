// Auth service — domain layer that owns the HTTP + UI side-effect decision.
// snackStore lives here (not in the infra layer below it).

import { snackStore } from '@aryagg/ui-kit';
import { AUTH } from './endpoints';
import type { LoginPayload, RegisterPayload, ResetPayload, AuthToken, IAuthUser } from '../types';
import { handleApiResponse } from '@aryagg/utils';
import { httpClient } from '$shared';

async function callWithToast<T>(
	promise: ReturnType<typeof handleApiResponse<T>>,
): Promise<Awaited<ReturnType<typeof handleApiResponse<T>>>> {
	const result = await promise;
	if (!result.isSuccess) snackStore.showError(result.message!);
	return result;
}

export const authApi = {
	login: (body: LoginPayload) =>
		callWithToast(handleApiResponse<AuthToken>(httpClient.post(AUTH.LOGIN, body), 'Login failed.')),

	register: (body: RegisterPayload) =>
		callWithToast(handleApiResponse<AuthToken>(httpClient.post(AUTH.REGISTER, body), 'Registration failed.')),

	forgotPassword: (email: string) =>
		callWithToast(handleApiResponse<void>(httpClient.post(AUTH.FORGOT_PASSWORD, { email }), 'Request failed.')),

	resetPassword: (body: ResetPayload) =>
		callWithToast(handleApiResponse<void>(httpClient.post(AUTH.RESET_PASSWORD, body), 'Reset failed.')),

	me: () => handleApiResponse<IAuthUser>(httpClient.get(AUTH.ME), 'Could not load profile.'),
	logout: () => handleApiResponse<void>(httpClient.post(AUTH.LOGOUT, {}), 'Logout failed.'),
	refresh: (body: { refreshToken: string }) =>
		handleApiResponse<AuthToken>(httpClient.post(AUTH.REFRESH, body), 'Token refresh failed.'),
};
