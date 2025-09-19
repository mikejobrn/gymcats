import { prisma } from '../../../lib/prisma'
import type { BonusType } from '@prisma/client'

export class PrismaBonusRepository {
  async applyBonus(userId: string, points: number, reason: string, type: string, dateISO?: string) {
    const date = dateISO ? new Date(dateISO + 'T00:00:00Z') : new Date()
    // create bonus and increment user's totalScore in a transaction
    return prisma.$transaction(async (tx) => {
      const bonus = await tx.bonus.create({ data: { userId, points, reason, type: type as BonusType, date } })
      const user = await tx.user.update({ where: { id: userId }, data: { totalScore: { increment: points } } })
      return { bonus, user }
    })
  }
}
