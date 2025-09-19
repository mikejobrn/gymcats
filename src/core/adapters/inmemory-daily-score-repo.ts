import type { Activity } from '../entities/activity'

type DailyScoreRow = {
  userId: string
  date: string
  score: number
  waterCompleted: boolean
  resistanceCompleted: boolean
  cardioCompleted: boolean
}

export class InMemoryDailyScoreRepository {
  private rows: DailyScoreRow[] = []

  async findByUserAndDate(userId: string, dateISO: string) {
    return this.rows.find(r => r.userId === userId && r.date === dateISO) ?? null
  }

  async upsert(userId: string, dateISO: string, score: number, activityType?: Activity['type']) {
    const existing = this.rows.find(r => r.userId === userId && r.date === dateISO)
    const existingWater = existing?.waterCompleted ?? false
    const existingResistance = existing?.resistanceCompleted ?? false
    const existingCardio = existing?.cardioCompleted ?? false

    const newWater = activityType === 'water' ? true : existingWater
    const newResistance = activityType === 'resistance' ? true : existingResistance
    const newCardio = activityType === 'cardio' ? true : existingCardio

    const row = { userId, date: dateISO, score, waterCompleted: newWater, resistanceCompleted: newResistance, cardioCompleted: newCardio }
    if (existing) {
      Object.assign(existing, row)
      return existing
    }
    this.rows.push(row)
    return row
  }
}
