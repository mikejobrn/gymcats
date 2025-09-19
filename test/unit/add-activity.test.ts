import { describe, it, expect } from 'vitest'
import { InMemoryActivityRepository } from '../../src/core/adapters/inmemory-activity-repo'
import { AddActivityUseCase } from '../../src/core/usecases/add-activity'
import { CalculateDailyScoreUseCase } from '../../src/core/usecases/calculate-daily-score'
import { FixedClock } from '../../src/core/adapters/clock/fixed-clock'

describe('AddActivityUseCase', () => {
  it('creates an activity and prevents duplicates of same type/day', async () => {
  const repo = new InMemoryActivityRepository()
  const clock = new FixedClock('2025-09-18T12:00:00Z')
  const add = new AddActivityUseCase(repo, clock)

    const activity1 = await add.execute({ userId: 'u1', type: 'water', when: new Date('2025-09-18T12:00:00Z') })
    expect(activity1).toHaveProperty('id')

    const activity2 = await add.execute({ userId: 'u1', type: 'water', when: new Date('2025-09-18T18:00:00Z') })
    expect(activity2.id).toBe(activity1.id)

    const scoreRules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }
  const calc = new CalculateDailyScoreUseCase(repo, scoreRules, clock)
  const score = await calc.execute('u1', new Date('2025-09-18T23:59:00Z'))
    expect(score).toBe(2)
  })
})
