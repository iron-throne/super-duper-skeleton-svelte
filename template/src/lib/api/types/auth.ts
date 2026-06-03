// ── Request payloads ──────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface ResetPayload {
    token: string;
    password: string;
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;      // seconds
}

export interface IAuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}
