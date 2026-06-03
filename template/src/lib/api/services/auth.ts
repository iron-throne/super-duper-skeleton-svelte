import { http } from '../http';
import { AUTH } from '../endpoints';
import type { LoginPayload, RegisterPayload, ResetPayload, AuthToken, IAuthUser } from '../types';

export const authApi = {
    login: (body: LoginPayload) => http.post<AuthToken>(AUTH.LOGIN, body),
    register: (body: RegisterPayload) => http.post<AuthToken>(AUTH.REGISTER, body),
    forgotPassword: (email: string) => http.post<void>(AUTH.FORGOT_PASSWORD, { email }),
    resetPassword: (body: ResetPayload) => http.post<void>(AUTH.RESET_PASSWORD, body),
    me: () => http.get<IAuthUser>(AUTH.ME),
    logout: () => http.post<void>(AUTH.LOGOUT),
    refresh: (body: { refreshToken: string }) => http.post<AuthToken>(AUTH.REFRESH, body),
};
