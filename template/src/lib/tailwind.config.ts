// Project-level Tailwind config.
// Extends the shared @aryagg/theme palette with app-specific colors.
// Note: no 'content' needed — scanning is handled by @source in app.css since v4 ignores it.

import type { Config } from 'tailwindcss';

const config: Config = {
    // Dark mode is toggled by adding/removing .dark on <html>
    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                // Add your project colors here — they sit alongside
                // the theme colors (accent, surface, primary, etc.)
                brand: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
            }
        }
    },

    plugins: []
};

export default config;
