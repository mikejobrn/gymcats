import { test, expect } from 'vitest'
import { GetRankingUseCase } from '../../src/core/usecases/get-ranking'
import { InMemoryUserRepository } from '../../src/core/adapters/inmemory/inmemory-user-repo'

test('get ranking returns ordered users with masked emails and rank', async () => {
  const users = [
    { id: 'u1', name: 'A', email: 'a@example.com', totalScore: 10, streakDays: 2, createdAt: '2024-01-01' },
    { id: 'u2', name: 'B', email: 'b@example.com', totalScore: 15, streakDays: 1, createdAt: '2024-01-02' }
  ]
  const repo = new InMemoryUserRepository(users)
  const usecase = new GetRankingUseCase(repo)
  const ranking = await usecase.execute(10)
  expect(ranking[0].id).toBe('u2')
  expect(ranking[0].rank).toBe(1)
  // email is present
  expect(typeof ranking[0].email).toBe('string')
})

test('throws when repository does not implement getRanking', async () => {
  const fakeRepo: any = { findById: async () => null }
  const usecase = new GetRankingUseCase(fakeRepo)
  await expect(usecase.execute(10)).rejects.toThrow('UserRepository.getRanking not implemented')
})
