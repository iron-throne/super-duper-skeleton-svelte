import { http } from '../http';
import { USER, buildUrl } from '../endpoints';
import type { User, UpdateUserPayload } from '../types';

export const userApi = {
    list: () => http.get<User[]>(USER.LIST),
    get: (id: string) => http.get<User>(buildUrl(USER.BY_ID, { id })),
    update: (id: string, body: UpdateUserPayload) => http.put<User>(buildUrl(USER.BY_ID, { id }), body),
    remove: (id: string) => http.delete<void>(buildUrl(USER.BY_ID, { id })),
};
