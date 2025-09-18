import { User } from "@prisma/client"

export type ExtendedUser = User & {
  totalScore: number
  streakDays: number
}

export interface ActivityRecord {
  id: string
  type: 'WATER' | 'RESISTANCE' | 'CARDIO'
  value: number
  date: Date
  points: number
}

export interface DailyProgress {
  date: string
  waterCompleted: boolean
  resistanceCompleted: boolean
  cardioCompleted: boolean
  totalPoints: number
  canEarnPoints: boolean
}

export interface ScoreRules {
  water: {
    threshold: number // liters
    points: number
  }
  resistance: {
    threshold: number // minutes
    points: number
  }
  cardio: {
    threshold: number // minutes
    points: number
  }
  bonuses: {
    streak3Days: number
    streak5Days: number
  }
  penalties: {
    missedDay: number
    noWorkoutWeek: number
  }
}

export interface UserRanking {
  user: ExtendedUser
  rank: number
  totalScore: number
  streakDays: number
}

export interface ActivityFormData {
  type: 'WATER' | 'RESISTANCE' | 'CARDIO'
  value: number
}

export interface PainelStats {
  todayScore: number
  totalScore: number
  streakDays: number
  waterProgress: number
  resistanceProgress: number
  cardioProgress: number
  canEarnMorePoints: boolean
}
