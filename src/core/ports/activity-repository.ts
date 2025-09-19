import { Activity } from "../entities/activity"

export interface ActivityRepository {
  findByUserIdAndDate(userId: string, dateISO: string): Promise<Activity | null>
  add(activity: Activity): Promise<void>
  listByUserAndRange(userId: string, startISO: string, endISO: string): Promise<Activity[]>
}
