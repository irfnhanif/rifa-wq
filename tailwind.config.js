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
            colors: {
                // Custom color palette based on your design
                brand: {
                    DEFAULT: '#1447E6',
                },
                text: {
                    heading: '#101828',
                    body: '#4A5565',
                    white: '#FFFFFF',
                },
                background: {
                    primary: '#FFFFFF',
                    soft: '#F9FAFB', // Used for page background and soft cards
                    secondary: '#E5E7EB', // Grayish background for badges/buttons
                },
                success: {
                    soft: '#ECFDF5',
                    strong: '#004F3B',
                },
                warning: {
                    soft: '#FFF8F1',
                    strong: '#B54708', // Inferred color
                },
                danger: {
                    soft: '#FEF0F2',
                    strong: '#B42318', // Inferred color
                },
                border: {
                    base: '#E5E7EB',
                },
            },
        },
    },

    plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
};
