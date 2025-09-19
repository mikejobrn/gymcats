import { ActivityRepository } from "../../ports/activity-repository"
import { Activity } from "../../entities/activity"

export class InMemoryActivityRepository implements ActivityRepository {
  private items: Activity[] = []

  async findByUserIdAndDate(userId: string, dateISO: string): Promise<Activity | null> {
    return this.items.find(i => i.userId === userId && i.date === dateISO) ?? null
  }

  async add(activity: Activity): Promise<void> {
    this.items.push(activity)
  }

  async listByUserAndRange(userId: string, startISO: string, endISO: string): Promise<Activity[]> {
    return this.items.filter(i => i.userId === userId && i.date >= startISO && i.date <= endISO)
  }
}
