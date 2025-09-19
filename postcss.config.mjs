// When running tests (Vitest), avoid loading Tailwind native plugins which
// may require platform-specific binaries. Vitest sets the VITEST env var.
let config
if (process.env.VITEST) {
  config = { plugins: [] }
} else {
  config = { plugins: ['@tailwindcss/postcss'] }
}

export default config
