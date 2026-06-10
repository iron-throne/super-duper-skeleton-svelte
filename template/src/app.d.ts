// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		/** Error shape returned to error pages */
		interface Error {
			message: string;
			code?: string;
		}
		/** Server-side locals set in hooks.server.ts */
		interface Locals {
			user: IAuthUser | null;
			isAuthenticated: boolean;
		}

	}
}

export { };
