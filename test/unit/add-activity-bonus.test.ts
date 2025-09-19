import { describe, it, expect } from 'vitest'
import { InMemoryActivityRepository } from '../../src/core/adapters/inmemory/inmemory-activity-repo'
import { InMemoryUserRepository } from '../../src/core/adapters/inmemory/inmemory-user-repo'
import { InMemoryDailyScoreRepository } from '../../src/core/adapters/inmemory/inmemory-daily-score-repo'
import { InMemoryBonusRepository } from '../../src/core/adapters/inmemory/inmemory-bonus-repo'
import { AddActivityUseCase } from '../../src/core/usecases/add-activity'
import { FixedClock } from '../../src/core/adapters/clock/fixed-clock'

describe('AddActivityUseCase with bonus flow', () => {
  it('applies 3-day consistency bonus and increments user totalScore', async () => {
    const activityRepo = new InMemoryActivityRepository()
    const userRepo = new InMemoryUserRepository([{ id: 'u1', email: 'u1@example.com', totalScore: 0, streakDays: 0, createdAt: new Date(), updatedAt: new Date(), lastActivity: null } as any])
    const dailyRepo = new InMemoryDailyScoreRepository()
    const bonusRepo = new InMemoryBonusRepository(userRepo)
    const clock = new FixedClock('2025-09-18T10:00:00Z')

    const rules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }

    // create activities for two previous days to form a 3-day streak once today's activity is added
    for (let d = 2; d >= 1; d--) {
      const when = new Date(Date.UTC(2025,8,18-d))
      // add a resistance activity each day via repository directly to seed history
      const iso = clock.isoDate(when)
      await activityRepo.add({ id: `a${d}`, userId: 'u1', type: 'resistance', date: iso })
    }

    // Now add today's activity using AddActivityUseCase passing bonusRepo so it can be applied
    const addUseCase = new AddActivityUseCase(activityRepo, clock, dailyRepo, rules, bonusRepo as any)
    await addUseCase.execute({ userId: 'u1', type: 'resistance' })

    // after executing, bonusRepo should have applied 3 points and updated user's totalScore
    const user = await userRepo.findById('u1')
    expect(user).toBeTruthy()
    // initial totalScore 0 + 3 bonus
    expect(user?.totalScore).toBe(3)
  })
})
