import { describe, it, expect } from 'vitest'
import { InMemoryActivityRepository } from '../../src/core/adapters/inmemory-activity-repo'
import { InMemoryDailyScoreRepository } from '../../src/core/adapters/inmemory-daily-score-repo'
import { AddActivityUseCase } from '../../src/core/usecases/add-activity'
import { FixedClock } from '../../src/core/adapters/clock/fixed-clock'

describe('DailyScore upsert merging flags', () => {
  it('preserves existing flags and sets new one when adding activity types', async () => {
    const activityRepo = new InMemoryActivityRepository()
    const dailyRepo = new InMemoryDailyScoreRepository()
    const clock = new FixedClock('2025-09-18T10:00:00Z')
    const rules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }

    const addUseCase = new AddActivityUseCase(activityRepo, clock, dailyRepo, rules)

    // add resistance first
    await addUseCase.execute({ userId: 'u1', type: 'resistance' })
    let ds = await dailyRepo.findByUserAndDate('u1', clock.isoDate())
    expect(ds).toBeTruthy()
    expect(ds?.resistanceCompleted).toBe(true)
    expect(ds?.waterCompleted).toBe(false)

    // add water, should preserve resistanceCompleted true and set waterCompleted true
    await addUseCase.execute({ userId: 'u1', type: 'water' })
    ds = await dailyRepo.findByUserAndDate('u1', clock.isoDate())
    expect(ds).toBeTruthy()
    expect(ds?.resistanceCompleted).toBe(true)
    expect(ds?.waterCompleted).toBe(true)
  })
})
