/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{astro,html,js,ts,jsx,tsx}",
        "./public/**/*.html",
    ],
    theme: {
        extend: {
            colors: {
                // Mapeo a variables CSS para consistencia con App Móvil
                'type-material': 'var(--type-material)',
                'type-safety': 'var(--type-safety)',
                'type-progress': 'var(--type-progress)',
                'type-problem': 'var(--type-problem)',
                'type-consultation': 'var(--type-consultation)',

                'status-approved': 'var(--status-approved)',
                'status-rejected': 'var(--status-rejected)',
                'status-pending': 'var(--status-pending)',

                'role-superintendent': 'var(--role-superintendent)',
                'role-resident': 'var(--role-resident)',
                'role-cabo': 'var(--role-cabo)',

                'brand': {
                    900: '#04263b',
                    700: '#0b3a59',
                    DEFAULT: '#0A58A3'
                },
                'accent': '#FF6B00'
            }
        },
    },
    plugins: [],
}
