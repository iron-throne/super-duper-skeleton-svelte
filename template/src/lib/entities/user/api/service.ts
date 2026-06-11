import { httpClient, handleApiResponse, buildUrl } from '$shared/api';
import { USER } from './endpoints';
import type { User, UpdateUserPayload } from '../types';

export const userApi = {
	list:   ()                                    => handleApiResponse<User[]>(httpClient.get(USER.LIST), 'Failed to load users.'),
	get:    (id: string)                          => handleApiResponse<User>(httpClient.get(buildUrl(USER.BY_ID, { id })), 'Failed to load user.'),
	update: (id: string, body: UpdateUserPayload) => handleApiResponse<User>(httpClient.put(buildUrl(USER.BY_ID, { id }), body), 'Failed to update user.'),
	remove: (id: string)                          => handleApiResponse<void>(httpClient.delete(buildUrl(USER.BY_ID, { id })), 'Failed to delete user.'),
};
