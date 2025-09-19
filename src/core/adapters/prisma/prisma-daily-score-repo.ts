import { prisma } from '../../../lib/prisma'
import type { Activity } from '../../entities/activity'
import type { ScoreRepository } from '../../ports/score-repository'

export class PrismaDailyScoreRepository implements ScoreRepository {
  async findByUserAndDate(userId: string, dateISO: string) {
    const dt = new Date(dateISO + 'T00:00:00Z')
    return prisma.dailyScore.findUnique({ where: { userId_date: { userId, date: dt } } })
  }

  /**
   * Upsert score and set the completion flag corresponding to activityType to true.
   * It merges with existing flags to avoid overwriting other completions.
   */
  async upsert(userId: string, dateISO: string, score: number, activityType?: Activity['type']) {
    const dt = new Date(dateISO + 'T00:00:00Z')

    // perform read + upsert in a single transaction to avoid race conditions
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.dailyScore.findUnique({ where: { userId_date: { userId, date: dt } } })
      const existingWater = existing?.waterCompleted ?? false
      const existingResistance = existing?.resistanceCompleted ?? false
      const existingCardio = existing?.cardioCompleted ?? false

      const newWater = activityType === 'water' ? true : existingWater
      const newResistance = activityType === 'resistance' ? true : existingResistance
      const newCardio = activityType === 'cardio' ? true : existingCardio

      return tx.dailyScore.upsert({
        where: { userId_date: { userId, date: dt } },
        create: {
          userId,
          date: dt,
          score,
          waterCompleted: newWater,
          resistanceCompleted: newResistance,
          cardioCompleted: newCardio,
        },
        update: {
          score,
          waterCompleted: newWater,
          resistanceCompleted: newResistance,
          cardioCompleted: newCardio,
        },
      })
    })

    return result
  }

  async listByUserAndRange(userId: string, startISO: string, endISO: string) {
    const start = new Date(startISO + 'T00:00:00Z')
    const end = new Date(endISO + 'T23:59:59Z')
    const rows = await prisma.dailyScore.findMany({ where: { userId, date: { gte: start, lte: end } }, orderBy: { date: 'asc' } })
    return rows
  }
}
