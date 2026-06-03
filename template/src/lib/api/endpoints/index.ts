export { AUTH } from './auth';
export { USER } from './user';
// export { PRODUCT } from './product';
// export { ORDER }   from './order';

// Replaces :param tokens with real values.
// buildUrl(USER.BY_ID, { id: '42' }) → '/api/users/42'
export function buildUrl(url: string, params: Record<string, string | number>): string {
    return Object.entries(params).reduce(
        (u, [key, val]) => u.replace(`:${key}`, String(val)),
        url
    );
}
