/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    yellow: '#FFD700', // gold
                    black: '#000000',
                },
            },
        },
    },
    plugins: [],
};