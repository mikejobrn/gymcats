import type { UserRepository } from '@/core/ports/user-repository'
import bcrypt from 'bcryptjs'

export type RegisterInput = {
  email: string
  password: string
  name?: string
}

export class RegisterUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: RegisterInput) {
    const existing = await this.userRepo.findByEmail(input.email)
    if (existing) {
      throw new Error('USER_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await this.userRepo.create({
      email: input.email,
      name: input.name || 'Gatinha',
      hashedPassword,
      totalScore: 0,
      streakDays: 0
    })

    return user
  }
}
