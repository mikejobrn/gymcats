import { prisma } from '@/lib/prisma'
import { getBrazilDate, getStartOfDay, getEndOfDay, formatDateForDB } from '@/lib/date-utils'
import { createActivityRepository, createDailyScoreRepository, createClock, createScoreRules } from '@/app/providers'
import { CalculateDailyScoreUseCase } from '@/core/usecases/calculate-daily-score'
import { AddActivityUseCase } from '@/core/usecases/add-activity'

export const SCORE_RULES = {
  water: {
    points: 2
  },
  resistance: {
    points: 3
  },
  cardio: {
    points: 2
  },
  bonuses: {
    streak3Days: 3,
    streak5Days: 5
  },
  penalties: {
    missedDay: -2,
    noWorkoutWeek: -2
  },
  maxDailyPoints: 7
}

export async function calculateDailyScore(userId: string, date: Date) {
  // Delegate to CalculateDailyScoreUseCase to keep business rules centralized
  const activityRepo = createActivityRepository()
  const clock = createClock()
  const rules = createScoreRules()
  const calc = new CalculateDailyScoreUseCase(activityRepo, rules, clock)
  const score = await calc.execute(userId, date)

  // Convert to previous shape
  return {
    score,
    waterCompleted: score >= rules.water,
    resistanceCompleted: score >= rules.resistance,
    cardioCompleted: score >= rules.cardio
  }
}

export async function addActivity(userId: string, type: 'WATER' | 'RESISTANCE' | 'CARDIO') {
  const activityRepo = createActivityRepository()
  const dailyRepo = createDailyScoreRepository()
  const clock = createClock()
  const scoreRules = createScoreRules()

  const addUseCase = new AddActivityUseCase(activityRepo, clock, dailyRepo as any, scoreRules)
  const activity = await addUseCase.execute({ userId, type: type.toLowerCase() as any })

  return activity
}

export async function getUserRanking() {
  const users = await prisma.user.findMany({
    orderBy: [
      { totalScore: 'desc' },
      { streakDays: 'desc' },
      { createdAt: 'asc' }
    ],
    take: 50
  })
  return users.map((user, index: number) => ({
    user,
    rank: index + 1,
    totalScore: user.totalScore,
    streakDays: user.streakDays
  }))
}
