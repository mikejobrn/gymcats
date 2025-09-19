import { PrismaActivityRepository } from '@/core/adapters/prisma/prisma-activity-repo'
import { PrismaDailyScoreRepository } from '@/core/adapters/prisma/prisma-daily-score-repo'
import { PrismaBonusRepository } from '@/core/adapters/prisma/prisma-bonus-repo'
import { PrismaUserRepository } from '@/core/adapters/prisma/prisma-user-repo'
import { SystemClock } from '@/core/adapters/clock/system-clock'

export function createActivityRepository() {
  return new PrismaActivityRepository()
}

export function createDailyScoreRepository() {
  return new PrismaDailyScoreRepository()
}

export function createBonusRepository() {
  return new PrismaBonusRepository()
}

export function createUserRepository() {
  return new PrismaUserRepository()
}

export function createClock() {
  return new SystemClock()
}

export function createScoreRules() {
  return { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }
}
