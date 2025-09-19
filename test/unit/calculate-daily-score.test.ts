import { describe, it, expect } from 'vitest'
import { InMemoryActivityRepository } from '../../src/core/adapters/inmemory/inmemory-activity-repo'
import { CalculateDailyScoreUseCase } from '../../src/core/usecases/calculate-daily-score'
import { FixedClock } from '../../src/core/adapters/clock/fixed-clock'

describe('CalculateDailyScoreUseCase', () => {
  it('returns 0 when there are no activities', async () => {
    const repo = new InMemoryActivityRepository()
    const clock = new FixedClock('2025-09-18T10:00:00Z')
    const rules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }
    const usecase = new CalculateDailyScoreUseCase(repo, rules, clock)

    const score = await usecase.execute('u1', clock.now())
    expect(score).toBe(0)
  })

  it('counts each activity type only once', async () => {
    const repo = new InMemoryActivityRepository()
    const clock = new FixedClock('2025-09-18T10:00:00Z')
    const rules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }
    const usecase = new CalculateDailyScoreUseCase(repo, rules, clock)

    const iso = clock.isoDate()
    // add two water entries and one resistance
    await repo.add({ id: 'a1', userId: 'u1', type: 'water', date: iso })
    await repo.add({ id: 'a2', userId: 'u1', type: 'water', date: iso })
    await repo.add({ id: 'a3', userId: 'u1', type: 'resistance', date: iso })

    const score = await usecase.execute('u1', clock.now())
    // water (2) + resistance (3) = 5
    expect(score).toBe(5)
  })

  it('caps score at dailyMax', async () => {
    const repo = new InMemoryActivityRepository()
    const clock = new FixedClock('2025-09-18T10:00:00Z')
    // set rules to allow high points
    const rules = { water: 5, resistance: 5, cardio: 5, dailyMax: 7 }
    const usecase = new CalculateDailyScoreUseCase(repo, rules, clock)

    const iso = clock.isoDate()
    await repo.add({ id: 'a1', userId: 'u1', type: 'water', date: iso })
    await repo.add({ id: 'a2', userId: 'u1', type: 'resistance', date: iso })
    await repo.add({ id: 'a3', userId: 'u1', type: 'cardio', date: iso })

    const score = await usecase.execute('u1', clock.now())
    // sum = 15 but capped to dailyMax (7)
    expect(score).toBe(7)
  })
})
