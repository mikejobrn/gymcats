#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    // perform a tiny transaction that reads the first user (if any) and does a harmless update
    await prisma.$transaction(async (tx) => {
      const u = await tx.user.findFirst()
      if (u) {
        await tx.user.update({ where: { id: u.id }, data: { totalScore: u.totalScore } })
      }
    })
    console.log('Prisma transaction OK')
    await prisma.$disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Prisma transaction script failed', err)
    try { await prisma.$disconnect() } catch {}
    process.exit(1)
  }
}

main()
