import { prisma } from '@/lib/prisma'
import { getBrazilDate, getStartOfDay, getEndOfDay, formatDateForDB } from '@/lib/date-utils'

export const SCORE_RULES = {
  water: {
    points: 2
  },
  resistance: {
    points: 3
  },
  cardio: {
    points: 2
  },
  bonuses: {
    streak3Days: 3,
    streak5Days: 5
  },
  penalties: {
    missedDay: -2,
    noWorkoutWeek: -2
  },
  maxDailyPoints: 7
}

export async function calculateDailyScore(userId: string, date: Date) {
  // calculateDailyScore invoked
  const startOfDay = getStartOfDay(date)
  const endOfDay = getEndOfDay(date)
  // Get all activities for the day
  const activities = await prisma.activityLog.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  })

  let score = 0
  let waterCompleted = false
  let resistanceCompleted = false
  let cardioCompleted = false

  // Check if each activity type is completed (marked as done)
  const hasWater = activities.some((a) => a.type === 'WATER' && a.completed)
  const hasResistance = activities.some((a) => a.type === 'RESISTANCE' && a.completed)
  const hasCardio = activities.some((a) => a.type === 'CARDIO' && a.completed)
  
  if (hasWater) {
    score += SCORE_RULES.water.points
    waterCompleted = true
  }

  if (hasResistance) {
    score += SCORE_RULES.resistance.points
    resistanceCompleted = true
  }

  if (hasCardio) {
    score += SCORE_RULES.cardio.points
    cardioCompleted = true
  }

  const result = {
    score: Math.min(score, SCORE_RULES.maxDailyPoints),
    waterCompleted,
    resistanceCompleted,
    cardioCompleted
  }
  
  // result prepared
  return result
}

export async function addActivity(
  userId: string,
  type: 'WATER' | 'RESISTANCE' | 'CARDIO'
) {
  // addActivity invoked
  const now = getBrazilDate()
  // determine today's period in Brazil time
  const startOfDay = getStartOfDay(now)
  const endOfDay = getEndOfDay(now)

  const existingActivity = await prisma.activityLog.findFirst({
    where: {
      userId,
      type,
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  })

  // existingActivity (if any) found
  let activity
  if (existingActivity) {
  // Update existing activity to toggle completed status
    activity = await prisma.activityLog.update({
      where: { id: existingActivity.id },
      data: {
        completed: !existingActivity.completed,
        date: now // Update timestamp
      }
    })
  } else {
  // Creating new activity as completed
    // Create new activity
    activity = await prisma.activityLog.create({
      data: {
        userId,
        type,
        completed: true,
        date: now
      }
    })
  }

  // Calculate daily score
  const dailyScore = await calculateDailyScore(userId, now)

  // Update or create daily score record - using date without time for consistency
  const dateForScore = formatDateForDB(now)
  // Defensive upsert approach for daily score
  const existingScore = await prisma.dailyScore.findUnique({
    where: {
      userId_date: {
        userId,
        date: dateForScore
      }
    }
  })

  let upsertedScore
  if (existingScore) {
  // updating existing daily score
    upsertedScore = await prisma.dailyScore.update({
      where: { id: existingScore.id },
      data: {
        score: dailyScore.score,
        waterCompleted: dailyScore.waterCompleted,
        resistanceCompleted: dailyScore.resistanceCompleted,
        cardioCompleted: dailyScore.cardioCompleted
      }
    })
  } else {
  // creating new daily score
    upsertedScore = await prisma.dailyScore.create({
      data: {
        userId,
        date: dateForScore,
        score: dailyScore.score,
        waterCompleted: dailyScore.waterCompleted,
        resistanceCompleted: dailyScore.resistanceCompleted,
        cardioCompleted: dailyScore.cardioCompleted
      }
    })
  }

  // Update user's total score
  const totalScore = await prisma.dailyScore.aggregate({
    where: { userId },
    _sum: { score: true }
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalScore: totalScore._sum.score || 0,
      lastActivity: now
    }
  })

  // End addActivity
  return activity
}

export async function getUserRanking() {
  const users = await prisma.user.findMany({
    orderBy: [
      { totalScore: 'desc' },
      { streakDays: 'desc' },
      { createdAt: 'asc' }
    ],
    take: 50
  })

  return users.map((user, index: number) => ({
    user,
    rank: index + 1,
    totalScore: user.totalScore,
    streakDays: user.streakDays
  }))
}
