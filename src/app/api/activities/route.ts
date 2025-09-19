import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { AddActivityUseCase } from '@/core/usecases/add-activity'
import { createDailyScoreRepository, createClock, createActivityRepository, createScoreRules, createBonusRepository, createUserRepository } from '@/app/providers'
// ...existing code...

export async function GET() {
  try {
    console.log('=== GET /api/activities chamado ===')
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('User email:', session.user.email)
  const userRepo = createUserRepository()
  const user = await userRepo.findByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('User ID:', user.id)
    
    // Use Clean Architecture: use-cases + adapters
  const dailyScoreRepo = createDailyScoreRepository()
  const clock = createClock()

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

  // Find user by email via repository
  const userRepo = createUserRepository()
  const user = await userRepo.findByEmail(session.user.email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

  // Use Clean Architecture use-cases/adapters to add activity and recalc score
  const activityRepo = createActivityRepository()
  const clock = createClock()
  const dailyRepo = createDailyScoreRepository()
  const scoreRules = createScoreRules()

    const typeMap: Record<string, 'water'|'resistance'|'cardio'> = {
      WATER: 'water',
      RESISTANCE: 'resistance',
      CARDIO: 'cardio'
    }
    const mappedType = typeMap[type]

  const bonusRepo = createBonusRepository()
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
