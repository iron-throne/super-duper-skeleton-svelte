// Tailwind CSS configuration
// Defines design tokens, custom themes, and plugin setup

import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{html,js,svelte,ts,css}', './node_modules/@aryagg/ui-kit/**/*.{html,js,svelte,ts}'],
    // Dark mode controlled via a `.dark` class (managed by your theme store)
    darkMode: 'class',

    theme: {
        extend: {
            colors: {

            }
        }
    },

    plugins: [
    ]
};

export default config;
