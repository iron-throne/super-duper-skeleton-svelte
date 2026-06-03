import type { IAuthUser } from '$lib/types';
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit";
import type { AvailableLanguageTag } from "$lib/paraglide/runtime";

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

		/** Data available in all pages via $page.data */
		interface PageData {
			// Add any global page data here
		}

		/** Platform-specific context (e.g., Cloudflare Workers env) */
		interface Platform { }
	}
}

export { };
