type Bonus = {
  id: string
  userId: string
  points: number
  reason: string
  type: string
  date: Date
}

export class InMemoryBonusRepository {
  public bonuses: Bonus[] = []
  private idCounter = 1
  constructor(private userRepo: any) {}

  async applyBonus(userId: string, points: number, reason: string, type: string, dateISO?: string) {
    const date = dateISO ? new Date(dateISO + 'T00:00:00Z') : new Date()
    const bonus = { id: `b${this.idCounter++}`, userId, points, reason, type, date }
    this.bonuses.push(bonus)

    // increment user's totalScore if userRepo supports update
    if (this.userRepo && typeof this.userRepo.update === 'function') {
      const user = await this.userRepo.findById(userId)
      const current = (user && (user.totalScore ?? 0)) || 0
      await this.userRepo.update(userId, { totalScore: (current as number) + points })
      const updated = await this.userRepo.findById(userId)
      return { bonus, user: updated }
    }

    return { bonus, user: null }
  }
}
