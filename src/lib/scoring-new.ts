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
  console.log('=== calculateDailyScore chamado ===')
  console.log('userId:', userId, 'date:', date)
  
  const startOfDay = getStartOfDay(date)
  const endOfDay = getEndOfDay(date)
  console.log('Período do dia:', { startOfDay, endOfDay })

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

  console.log('Atividades encontradas para o dia:', activities)

  let score = 0
  let waterCompleted = false
  let resistanceCompleted = false
  let cardioCompleted = false

  // Check if each activity type is completed (marked as done)
  const hasWater = activities.some((a) => a.type === 'WATER' && a.completed)
  const hasResistance = activities.some((a) => a.type === 'RESISTANCE' && a.completed)
  const hasCardio = activities.some((a) => a.type === 'CARDIO' && a.completed)
  
  console.log('Verificações de atividade:', { hasWater, hasResistance, hasCardio })
  
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
  
  console.log('Resultado calculateDailyScore:', result)
  return result
}

export async function addActivity(
  userId: string,
  type: 'WATER' | 'RESISTANCE' | 'CARDIO'
) {
  console.log('=== addActivity chamado ===')
  console.log('userId:', userId, 'type:', type)
  
  const now = getBrazilDate()
  console.log('Data atual (Brasil):', now)
  
  // Check if activity already exists for today
  const startOfDay = getStartOfDay(now)
  const endOfDay = getEndOfDay(now)
  console.log('Início do dia:', startOfDay)
  console.log('Fim do dia:', endOfDay)

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

  console.log('Atividade existente encontrada:', existingActivity)

  let activity
  if (existingActivity) {
    // Update existing activity to toggle completed status
    console.log('Toggleando atividade existente de', existingActivity.completed, 'para', !existingActivity.completed)
    activity = await prisma.activityLog.update({
      where: { id: existingActivity.id },
      data: {
        completed: !existingActivity.completed,
        date: now // Update timestamp
      }
    })
  } else {
    console.log('Criando nova atividade como completed: true')
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

  console.log('Atividade após operação:', activity)

  // Calculate daily score
  const dailyScore = await calculateDailyScore(userId, now)
  console.log('Score diário calculado:', dailyScore)

  // Update or create daily score record - using date without time for consistency
  const dateForScore = formatDateForDB(now)
  console.log('Data para o score:', dateForScore)
  
  const upsertedScore = await prisma.dailyScore.upsert({
    where: {
      userId_date: {
        userId,
        date: dateForScore
      }
    },
    update: {
      score: dailyScore.score,
      waterCompleted: dailyScore.waterCompleted,
      resistanceCompleted: dailyScore.resistanceCompleted,
      cardioCompleted: dailyScore.cardioCompleted
    },
    create: {
      userId,
      date: dateForScore,
      score: dailyScore.score,
      waterCompleted: dailyScore.waterCompleted,
      resistanceCompleted: dailyScore.resistanceCompleted,
      cardioCompleted: dailyScore.cardioCompleted
    }
  })

  console.log('Score upserted:', upsertedScore)

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

  console.log('=== Fim addActivity ===')
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
