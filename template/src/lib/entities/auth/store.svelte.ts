import { EUserRole } from '@aryagg/types';
import type { IAuthUser } from './types';

let _authState = $state<IAuthUser | null>(null);

const isAdmin = $derived(
	_authState?.role === EUserRole.ADMIN ||
	_authState?.role === EUserRole.SUPER_ADMIN,
);

const isSuperAdmin = $derived(_authState?.role === EUserRole.SUPER_ADMIN);

const displayName = $derived(_authState?.name ?? _authState?.email ?? '');

function setUser(user: IAuthUser) {
	_authState = user;
}

function clearUser() {
	_authState = null;
}

function hasRole(role: EUserRole): boolean {
	if (!_authState) return false;
	const hierarchy = [
		EUserRole.GUEST,
		EUserRole.USER,
		EUserRole.MANAGER,
		EUserRole.ADMIN,
		EUserRole.SUPER_ADMIN,
	];
	return hierarchy.indexOf(_authState.role as EUserRole) >= hierarchy.indexOf(role);
}

function hasPermission(roles: EUserRole[]): boolean {
	return roles.some((role) => hasRole(role));
}

export const authStore = {
	get state()           { return _authState; },
	get user()            { return _authState; },
	get isAuthenticated() { return !!_authState; },
	get isAdmin()         { return isAdmin; },
	get isSuperAdmin()    { return isSuperAdmin; },
	get displayName()     { return displayName; },
	setUser,
	clearUser,
	hasRole,
	hasPermission,
};
