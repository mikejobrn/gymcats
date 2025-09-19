import type { Activity } from '../../entities/activity'
import { v4 as uuid } from 'uuid'

type DailyScoreRow = {
  id: string
  userId: string
  date: string
  score: number
  waterCompleted: boolean
  resistanceCompleted: boolean
  cardioCompleted: boolean
  createdAt: Date
  updatedAt: Date
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

    const now = new Date()
    const row: DailyScoreRow = { 
      id: existing?.id ?? uuid(), 
      userId, 
      date: dateISO, 
      score, 
      waterCompleted: newWater, 
      resistanceCompleted: newResistance, 
      cardioCompleted: newCardio,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    }
    if (existing) {
      Object.assign(existing, row)
      return existing
    }
    this.rows.push(row)
    return row
  }

  async listByUserAndRange(userId: string, startISO: string, endISO: string) {
    return this.rows.filter(r => r.userId === userId && r.date >= startISO && r.date <= endISO)
  }
}
