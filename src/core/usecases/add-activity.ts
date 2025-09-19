import { Activity, ActivityType } from "../entities/activity"
import { ActivityRepository } from "../ports/activity-repository"
import { v4 as uuid } from 'uuid'
import type { Clock } from "../ports/clock"
import type { ScoreRepository } from "../ports/score-repository"
import { CalculateDailyScoreUseCase } from "./calculate-daily-score"
import { ApplyConsistencyBonusesUseCase } from "./consistency-bonus"
import type { PrismaBonusRepository } from "../adapters/prisma/prisma-bonus-repo"

export type ScoreRules = {
  water: number
  resistance: number
  cardio: number
  dailyMax: number
}

export type AddActivityInput = {
  userId: string
  type: ActivityType
  when?: Date
}

export class AddActivityUseCase {
  constructor(private activityRepo: ActivityRepository, private clock: Clock, private dailyRepo?: ScoreRepository, private rules?: ScoreRules, private bonusRepo?: PrismaBonusRepository) {}

  async execute(input: AddActivityInput): Promise<Activity> {
    const when = input.when ? this.clock.startOfDay(input.when) : this.clock.startOfDay()
    const dateISO = this.clock.isoDate(when)

    const existing = await this.activityRepo.findByUserIdAndDate(input.userId, dateISO)
    if (existing && existing.type === input.type) {
      return existing
    }

    const activity: Activity = {
      id: uuid(),
      userId: input.userId,
      type: input.type,
      date: dateISO
    }

    await this.activityRepo.add(activity)

    // If a daily repo and rules are provided, recalc score and persist daily flags
    if (this.dailyRepo && this.rules) {
      const calc = new CalculateDailyScoreUseCase(this.activityRepo, this.rules, this.clock)
      const score = await calc.execute(input.userId, when)
      await this.dailyRepo.upsert(input.userId, dateISO, score, activity.type)

      // apply consistency bonus if any
      if (this.bonusRepo) {
        const bonusUsecase = new ApplyConsistencyBonusesUseCase(this.activityRepo, this.clock)
        const bonusPoints = await bonusUsecase.execute(input.userId, when)
        if (bonusPoints > 0) {
          const reason = bonusPoints === 5 ? 'STREAK_5_DAYS' : 'STREAK_3_DAYS'
          await this.bonusRepo.applyBonus(input.userId, bonusPoints, `Consistency bonus ${bonusPoints}`, reason, dateISO)
        }
      }
    }

    return activity
  }
}
