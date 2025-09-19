import { spawnSync } from 'child_process'
import { test, expect } from 'vitest'

test('prisma transactional flow script exits 0', () => {
  const runner = spawnSync('node', ['scripts/run-prisma-integration.js'], { stdio: 'inherit' })
  expect(runner.status).toBe(0)
})
