import { defineConfig } from '@prisma/config'

export default defineConfig({
  seed: {
    command: 'ts-node --transpile-only prisma/seed.ts'
  }
})