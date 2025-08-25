// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/js/**/*.tsx', // Make sure it scans .tsx files
        'node_modules/flowbite-react/lib/esm/**/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Sets the default sans-serif font to the system's default
                sans: ['system-ui', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
