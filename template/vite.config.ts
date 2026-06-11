import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    // Enables TailwindCSS inside Vite
    tailwindcss(),

    // Auto-import plugin (no need to manually import onMount, writable, goto, etc.)
    AutoImport({
      // Which files should be scanned for auto-import usage
      include: [
        /\.[tj]s?$/,   // JS + TS files
        /\.svelte$/,   // Svelte components
      ],

      // What to auto-import
      imports: [
        'svelte',            // onMount, beforeUpdate, afterUpdate, tick, etc.
        'svelte/store',      // writable, readable, derived
        'svelte/transition', // fade, fly, slide, etc.

        // Auto-import SvelteKit functions
        {
          '$app/navigation': ['goto', 'invalidate', 'invalidateAll'],
          '@sveltejs/kit': ['redirect'],
        }, {
          '$lib/paraglide/messages': [
            ['*', 'm']   // import * as m from '$lib/paraglide/messages'
          ]
        }
      ],

      // Generate TypeScript definitions for auto-imported functions
      dts: './src/auto-imports.d.ts',
    }),

    // SvelteKit plugin (must come after other Vite plugins)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sveltekit() as unknown as import('vite').PluginOption,

    // Paraglide i18n plugin (for translations)
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    }),
  ]
});
