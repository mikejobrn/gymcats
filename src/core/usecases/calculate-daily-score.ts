import { ActivityRepository } from "../ports/activity-repository"
import type { Clock } from "../ports/clock"

export type ScoreRules = {
  water: number
  resistance: number
  cardio: number
  dailyMax: number
}

export class CalculateDailyScoreUseCase {
  constructor(private activityRepo: ActivityRepository, private rules: ScoreRules, private clock?: Clock) {}

  async execute(userId: string, when?: Date): Promise<number> {
    const day = when ? (this.clock ? this.clock.startOfDay(when) : new Date(when)) : (this.clock ? this.clock.startOfDay() : new Date())
    const iso = this.clock ? this.clock.isoDate(day) : day.toISOString().slice(0,10)

    const activities = await this.activityRepo.listByUserAndRange(userId, iso, iso)

    let score = 0
    const typesSeen = new Set<string>()
    for (const a of activities) {
      if (!typesSeen.has(a.type)) {
        typesSeen.add(a.type)
        if (a.type === 'water') score += this.rules.water
        if (a.type === 'resistance') score += this.rules.resistance
        if (a.type === 'cardio') score += this.rules.cardio
      }
    }

    if (score > this.rules.dailyMax) score = this.rules.dailyMax
    return score
  }
}
