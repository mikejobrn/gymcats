import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { PrismaActivityRepository } from '@/core/adapters/prisma/prisma-activity-repo'
import { PrismaDailyScoreRepository } from '@/core/adapters/prisma/prisma-daily-score-repo'
import { PrismaBonusRepository } from '@/core/adapters/prisma/prisma-bonus-repo'
import { SystemClock } from '@/core/adapters/clock/system-clock'
import { AddActivityUseCase } from '@/core/usecases/add-activity'
// ...existing code...

export async function GET() {
  try {
    console.log('=== GET /api/activities chamado ===')
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('User email:', session.user.email)
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('User ID:', user.id)
    
    // Use Clean Architecture: use-cases + adapters
    const dailyScoreRepo = new PrismaDailyScoreRepository()
    const clock = new SystemClock()

    const dateForScore = clock.isoDate()
    const todayScore = await dailyScoreRepo.findByUserAndDate(user.id, dateForScore)
    
    console.log('TodayScore encontrado:', todayScore)
    
    const response = { todayScore, totalScore: user.totalScore, streakDays: user.streakDays }
    
    console.log('Resposta final GET:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const activitySchema = z.object({
  type: z.enum(['WATER', 'RESISTANCE', 'CARDIO'])
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const body = await request.json()
  const { type } = activitySchema.parse(body)

    // Find user by email
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

  // Use Clean Architecture use-cases/adapters to add activity and recalc score
  const activityRepo = new PrismaActivityRepository()
  const clock = new SystemClock()
  const dailyRepo = new (await import('@/core/adapters/prisma/prisma-daily-score-repo')).PrismaDailyScoreRepository()
  const scoreRules = { water: 2, resistance: 3, cardio: 2, dailyMax: 7 }

    const typeMap: Record<string, 'water'|'resistance'|'cardio'> = {
      WATER: 'water',
      RESISTANCE: 'resistance',
      CARDIO: 'cardio'
    }
    const mappedType = typeMap[type]

  const bonusRepo = new PrismaBonusRepository()
  const addUseCase = new AddActivityUseCase(activityRepo, clock, dailyRepo, scoreRules, bonusRepo)
    const activity = await addUseCase.execute({ userId: user.id, type: mappedType })

    const dateForScore = clock.isoDate()
    const updatedScore = await dailyRepo.findByUserAndDate(user.id, dateForScore)

    return NextResponse.json({ success: true, activity: { id: activity.id, type: activity.type, date: activity.date }, updatedScore })

  } catch (error) {
    console.error('Error adding activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
