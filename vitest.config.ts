import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  include: ['test/unit/**/*.test.ts', 'test/integration/**/*.test.ts'],
    globals: false,
    passWithNoTests: false,
  },
  // keep esbuild target modern
  esbuild: {
    target: 'es2020'
  }
})
