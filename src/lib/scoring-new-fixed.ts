import { createActivityRepository, createDailyScoreRepository, createUserRepository, createClock, createScoreRules, createBonusRepository } from '@/app/providers'
import { CalculateDailyScoreUseCase } from '@/core/usecases/calculate-daily-score'
import { AddActivityUseCase } from '@/core/usecases/add-activity'
import { GetRankingUseCase } from '@/core/usecases/get-ranking'

export const SCORE_RULES = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }

export async function calculateDailyScore(userId: string, date: Date) {
  const activityRepo = createActivityRepository()
  const rules = SCORE_RULES
  const clock = createClock()
  const calc = new CalculateDailyScoreUseCase(activityRepo, rules, clock)
  const score = await calc.execute(userId, date)
  // Return shape compatible with previous implementation (score + flags)
  // We'll derive flags by listing activities for the day
  const activities = await activityRepo.listByUserAndRange(userId, clock.isoDate(date), clock.isoDate(date))
  const hasWater = activities.some(a => a.type === 'water')
  const hasResistance = activities.some(a => a.type === 'resistance')
  const hasCardio = activities.some(a => a.type === 'cardio')
  return {
    score,
    waterCompleted: hasWater,
    resistanceCompleted: hasResistance,
    cardioCompleted: hasCardio
  }
}

export async function addActivity(userId: string, type: 'WATER' | 'RESISTANCE' | 'CARDIO') {
  const activityRepo = createActivityRepository()
  const dailyRepo = createDailyScoreRepository()
  const bonusRepo = createBonusRepository()
  const clock = createClock()
  const rules = createScoreRules()

  const typeMap: Record<string, 'water'|'resistance'|'cardio'> = {
    WATER: 'water',
    RESISTANCE: 'resistance',
    CARDIO: 'cardio'
  }

  const addUseCase = new AddActivityUseCase(activityRepo, clock, dailyRepo, rules, bonusRepo)
  const activity = await addUseCase.execute({ userId, type: typeMap[type] })
  return activity
}

export async function getUserRanking() {
  const userRepo = createUserRepository()
  const usecase = new GetRankingUseCase(userRepo)
  const ranking = await usecase.execute(50)
  return ranking
}
