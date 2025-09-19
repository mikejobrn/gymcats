import { describe, it, expect } from 'vitest'
import { RegisterUserUseCase } from '../../src/core/usecases/register-user'
import { InMemoryUserRepository } from '../../src/core/adapters/inmemory/inmemory-user-repo'

describe('RegisterUserUseCase', () => {
  it('creates a user when email is not taken', async () => {
    const repo = new InMemoryUserRepository()
    const usecase = new RegisterUserUseCase(repo)

    const input = { email: 'test@example.com', password: 'secret', name: 'Test' }
    const user = await usecase.execute(input)

    expect(user).toBeTruthy()
    expect(user.email).toBe(input.email)
    expect(user.name).toBe(input.name)
    expect(user.hashedPassword).toBeTruthy()
    expect(user.totalScore).toBe(0)
    expect(user.streakDays).toBe(0)
  })

  it('throws USER_EXISTS when email already registered', async () => {
    const existing = { id: 'u1', email: 'taken@example.com', name: 'Taken', hashedPassword: 'h', totalScore: 0, streakDays: 0, lastActivity: null, createdAt: new Date(), updatedAt: new Date() }
    const repo = new InMemoryUserRepository([existing as any])
    const usecase = new RegisterUserUseCase(repo)

    await expect(usecase.execute({ email: 'taken@example.com', password: 'x' })).rejects.toThrow('USER_EXISTS')
  })
})
