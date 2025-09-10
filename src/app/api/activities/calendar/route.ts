import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getBrazilDate } from '@/lib/date-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || getBrazilDate().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || getBrazilDate().getMonth().toString())

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get start and end dates for the month in Brazil timezone
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)
    
    // Query daily scores for the month
    const dailyScores = await prisma.dailyScore.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Format the response
    const activities = dailyScores.map(score => ({
      date: score.date.toISOString().split('T')[0],
      waterCompleted: score.waterCompleted,
      resistanceCompleted: score.resistanceCompleted,
      cardioCompleted: score.cardioCompleted,
      totalScore: score.score
    }))

    return NextResponse.json({ 
      activities,
      month: month,
      year: year
    })

  } catch (error) {
    console.error('Error fetching calendar activities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
