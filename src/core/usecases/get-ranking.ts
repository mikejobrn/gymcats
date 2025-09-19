import type { UserRepository } from '../ports/user-repository'

export class GetRankingUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(limit = 50) {
    if (this.userRepo.getRanking) {
      return this.userRepo.getRanking(limit)
    }
    // fallback: try to use a naive approach if repo doesn't implement getRanking
    throw new Error('UserRepository.getRanking not implemented')
  }
}
