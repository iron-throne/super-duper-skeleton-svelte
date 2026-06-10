// src/lib/stores/auth.store.ts
// Centralized authentication store using Svelte 5 Runes.
// Holds user info, roles, loading state, and permissions.

import { EUserRole, type IAuthUser } from "@aryagg/types";


let _authState = $state<IAuthUser | null>(null);

const isAdmin = $derived(
    _authState?.role === EUserRole.ADMIN ||
    _authState?.role === EUserRole.SUPER_ADMIN
);

const isSuperAdmin = $derived(
    _authState?.role === EUserRole.SUPER_ADMIN
);

const displayName = $derived(
    _authState?.name ?? _authState?.email ?? ''
);


/** Set authenticated user after login */
function setUser(user: IAuthUser) {
    _authState = user;
}

/** Clear all auth data (logout) */
function clearUser() {
    _authState = null;
}


/** Check if user has a minimum required role */
function hasRole(role: EUserRole): boolean {
    if (!_authState) return false;

    const hierarchy = [
        EUserRole.GUEST,
        EUserRole.USER,
        EUserRole.MANAGER,
        EUserRole.ADMIN,
        EUserRole.SUPER_ADMIN
    ];

    return hierarchy.indexOf(_authState.role) >= hierarchy.indexOf(role);
}

/** Check if user has any of the allowed roles */
function hasPermission(roles: EUserRole[]): boolean {
    return roles.some((role) => hasRole(role));
}

// ─────────────────────────────────────────────────────────────
// Public API (clean, grouped, easy to import)
// ─────────────────────────────────────────────────────────────

export const authStore = {
    // State getters
    get state() { return _authState; },
    get user() { return _authState; },
    get isAuthenticated() { return !!_authState; },

    // Derived getters
    get isAdmin() { return isAdmin; },
    get isSuperAdmin() { return isSuperAdmin; },
    get displayName() { return displayName; },

    // Actions
    setUser,
    clearUser,
    hasRole,
    hasPermission
};
