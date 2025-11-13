/** PostCSS config for Astro + Tailwind
 *
 * Newer Tailwind setups may require the separate PostCSS plugin package
 * `@tailwindcss/postcss`. If you still have the old setup, installing that
 * package and using it here avoids the runtime error shown in the screenshot.
 */
module.exports = {
    // Use plugin names as keys so PostCSS can resolve them correctly and
    // avoid passing `tailwindcss` itself directly as a plugin function.
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
};
