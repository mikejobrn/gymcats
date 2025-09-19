export type ActivityType = 'water' | 'resistance' | 'cardio'

export interface Activity {
  id: string
  userId: string
  type: ActivityType
  date: string // ISO date (YYYY-MM-DD) to normalize day-scoped activities
}
