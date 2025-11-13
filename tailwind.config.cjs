/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{astro,html,js,ts,jsx,tsx}",
        "./public/**/*.html",
    ],
    theme: {
        extend: {
            colors: {
                'brand-900': '#04263b',
                'brand-700': '#0b3a59',
                'accent': '#ff7a00'
            }
        },
    },
    plugins: [],
}
