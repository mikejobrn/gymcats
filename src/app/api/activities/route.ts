import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addActivity } from '@/lib/scoring-new'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET /api/activities chamado ===')
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('User email:', session.user.email)
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('User ID:', user.id)
    
    // Score do dia (DailyScore) - usar mesma lógica do addActivity
    const { getBrazilDate, formatDateForDB } = await import('@/lib/date-utils')
    const now = getBrazilDate()
    const dateForScore = formatDateForDB(now)
    console.log('Data para buscar score (corrigida):', dateForScore)
    
    const todayScore = await prisma.dailyScore.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: dateForScore,
        },
      },
    })
    
    console.log('TodayScore encontrado:', todayScore)
    
    const response = {
      todayScore,
      totalScore: user.totalScore,
      streakDays: user.streakDays,
    }
    
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add/toggle activity
    const activity = await addActivity(user.id, type)

    // Buscar o estado atualizado imediatamente após a operação
    const { getBrazilDate, formatDateForDB } = await import('@/lib/date-utils')
    const now = getBrazilDate()
    const dateForScore = formatDateForDB(now)
    
    const updatedScore = await prisma.dailyScore.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: dateForScore,
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      activity: {
        id: activity.id,
        type: activity.type,
        completed: activity.completed,
        date: activity.date
      },
      updatedScore: updatedScore
    })

  } catch (error) {
    console.error('Error adding activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
