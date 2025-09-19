import { PrismaClient } from '@prisma/client'
import { test, expect } from 'vitest'

test('prisma transactional flow succeeds', async () => {
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    await prisma.$transaction(async (tx) => {
      const u = await tx.user.findFirst()
      if (u) {
        await tx.user.update({ where: { id: u.id }, data: { totalScore: u.totalScore } })
      }
    })
    await prisma.$disconnect()
    expect(true).toBe(true)
  } catch (err) {
    try { await prisma.$disconnect() } catch {}
    throw err
  }
})
