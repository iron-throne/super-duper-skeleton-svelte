import { resolve } from '$app/paths';

// ── Auth routes ───────────────────────────────────────
export const LOGIN_ROUTE = resolve('/login', {});
export const REGISTER_ROUTE = resolve('/register', {});
export const LOGOUT_ROUTE = resolve('/logout', {});
export const FORGOT_PASSWORD_ROUTE = resolve('/forgot-password', {});
export const RESET_PASSWORD_ROUTE = resolve('/reset-password', {});

// ── App routes ────────────────────────────────────────
export const DASHBOARD_ROUTE = resolve('/', {});
export const PROFILE_ROUTE = resolve('/profile', {});
export const SETTINGS_ROUTE = resolve('/settings', {});
export const THEME_ROUTE = resolve('/theme', {});

// ── Admin routes ──────────────────────────────────────
export const ADMIN_ROUTE = resolve('/admin', {});
export const ADMIN_USERS_ROUTE = resolve('/admin/users', {});
