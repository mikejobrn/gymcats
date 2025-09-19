import { ActivityRepository } from "../ports/activity-repository"
import type { Clock } from "../ports/clock"


export class ApplyConsistencyBonusesUseCase {
  constructor(private activityRepo: ActivityRepository, private clock: Clock) {}

  // returns bonus points to be applied for the day
  async execute(userId: string, when: Date): Promise<number> {
    const today = this.clock.startOfDay(when)

    // check last 5 days (including today)
    const dayISOs: string[] = []
    for (let i = 0; i < 5; i++) {
      // create a Date object for subDays via advancing from today
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      dayISOs.push(this.clock.isoDate(d))
    }

    // fetch activities across range
    const startISO = dayISOs[dayISOs.length - 1]
    const endISO = dayISOs[0]
    const activities = await this.activityRepo.listByUserAndRange(userId, startISO, endISO)

    // map day -> hadActivity (any type)
    const map = new Map<string, boolean>()
    for (const d of dayISOs) map.set(d, false)
    for (const a of activities) {
      if (map.has(a.date)) map.set(a.date, true)
    }

    // compute streak including today
    let streak = 0
    for (let i = 0; i < dayISOs.length; i++) {
      const d = dayISOs[i]
      if (map.get(d)) streak++
      else break
    }

    if (streak >= 5) return 5
    if (streak >= 3) return 3
    return 0
  }
}
