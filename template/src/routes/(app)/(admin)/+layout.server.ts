import { redirect } from '@sveltejs/kit';
import { LOGIN_ROUTE, DASHBOARD_ROUTE } from '$shared/config';
import { EUserRole } from '@aryagg/types';

export async function load({ locals }) {
	if (!locals.isAuthenticated || !locals.user) {
		throw redirect(303, LOGIN_ROUTE);
	}
	const { role } = locals.user;
	if (role !== EUserRole.ADMIN && role !== EUserRole.SUPER_ADMIN) {
		throw redirect(303, DASHBOARD_ROUTE);
	}
	return {};
}
