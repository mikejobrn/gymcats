import { describe, it, expect } from 'vitest'
import { InMemoryActivityRepository } from '../../src/core/adapters/inmemory/inmemory-activity-repo'
import { ApplyConsistencyBonusesUseCase } from '../../src/core/usecases/consistency-bonus'
import { FixedClock } from '../../src/core/adapters/clock/fixed-clock'

describe('ApplyConsistencyBonusesUseCase', () => {
  it('awards 3 pts for 3-day streak and 5 pts for 5-day streak', async () => {
    const repo = new InMemoryActivityRepository()
    const clock = new FixedClock('2025-09-18T10:00:00Z')

    // create activities for day 0, -1, -2 -> 3-day streak
    for (const d of [0,1,2]) {
      const iso = new Date(Date.UTC(2025,8,18-d)).toISOString().slice(0,10)
      await repo.add({ id: `a${d}`, userId: 'u1', type: 'resistance', date: iso })
    }

    const usecase = new ApplyConsistencyBonusesUseCase(repo, clock)
    const bonus = await usecase.execute('u1', clock.now())
    expect(bonus).toBe(3)

    // add day -3 and -4 to make 5 streak
    for (const d of [3,4]) {
      const iso = new Date(Date.UTC(2025,8,18-d)).toISOString().slice(0,10)
      await repo.add({ id: `a${d}`, userId: 'u1', type: 'water', date: iso })
    }

    const bonus2 = await usecase.execute('u1', clock.now())
    expect(bonus2).toBe(5)
  })
})
