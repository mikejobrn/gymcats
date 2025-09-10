export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // Score do dia (DailyScore)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayScore = await prisma.dailyScore.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    })
    return NextResponse.json({
      todayScore,
      totalScore: user.totalScore,
      streakDays: user.streakDays,
    })
  } catch (error) {
    console.error('Error fetching user score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addActivity } from '@/lib/scoring-new'
import { z } from 'zod'

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

    return NextResponse.json({ 
      success: true, 
      activity: {
        id: activity.id,
        type: activity.type,
        completed: activity.completed,
        date: activity.date
      }
    })

  } catch (error) {
    console.error('Error adding activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
