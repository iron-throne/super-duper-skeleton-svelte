import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { loadEnv } from 'vite';

// Load environment variables based on NODE_ENV or default to 'development'
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), 'PUBLIC_');// Only load variables that start with PUBLIC_ to avoid exposing sensitive data

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ---------------------------------------------------------
	// PREPROCESSORS
	// ---------------------------------------------------------

	// Enables TypeScript, PostCSS, and things like Tailwind inside .svelte files.
	// Without this, SvelteKit won't understand <script lang="ts"> or Tailwind classes.
	preprocess: vitePreprocess(),

	// Click element in browser → jump to source file
	vitePlugin: {
		inspector: true
	},

	kit: {
		// -----------------------------------------------------
		// ADAPTER
		// -----------------------------------------------------

		// adapter-node builds your app into a Node.js server.
		// Use this when deploying to a VPS, Docker, or any Node environment.
		// precompress: false → You handle gzip/brotli compression yourself (e.g., Cloudflare).
		adapter: adapter({ precompress: false }),

		// Allows deploying your app under a subfolder.
		// Example: https://example.com/myapp → base = '/myapp'
		paths: {
			base: /** @type {'' | `/${string}`} */ (env.PUBLIC_BASE_PATH || '')
		},
		// Lets you write: import Button from '$components/Button.svelte'
		// instead of: import Button from '../../../lib/components/Button.svelte'
		alias: {
			// ── FSD Layers ──────────────────────────────────────────────
			$shared:   'src/lib/shared',     // HTTP client, i18n, global constants
			$entities: 'src/lib/entities',   // Business domains: auth, user, config
			$features: 'src/lib/features',   // User-interaction slices: theme-editor, etc.
			$widgets:  'src/lib/widgets',    // Composite UI blocks: Topbar, Sidebar, etc.
			// ── Kept as-is ──────────────────────────────────────────────
			$paraglide: 'src/lib/paraglide', // Auto-generated i18n (do not edit manually)
			$styles:    'src/lib/styles',
			$server:    'src/lib/server',
		},

		// CSP (Content Security Policy) helps prevent XSS attacks.
		// mode: 'auto' → SvelteKit automatically adds safe nonces to inline scripts.
		csp: { mode: 'auto' },

		// -----------------------------------------------------
		// PERFORMANCE
		// -----------------------------------------------------

		// Splits your JS into smaller chunks per route.
		// This reduces initial load time for large apps.
		output: { bundleStrategy: 'split' },

		version: {
			// Uses a timestamp as the version string.
			// Ensures the version changes every build → browser knows to refresh.
			name: Date.now().toString(),

			// How often the browser checks the server for a new version (in ms).
			// 600,000 ms = 10 minutes.
			// Lower this if you want faster auto-updates.
			pollInterval: 600_000
		}
	}
};

export default config;
