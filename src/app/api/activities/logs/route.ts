import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createUserRepository, createActivityRepository } from '@/app/providers'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    if (!dateStr) {
      return NextResponse.json({ error: 'Missing date' }, { status: 400 })
    }
  const userRepo = createUserRepository()
  const user = await userRepo.findByEmail(session.user.email as string)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // Busca atividades do dia
    const start = new Date(dateStr)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setHours(23, 59, 59, 999)
  const activityRepo = createActivityRepository()
  const activities = await activityRepo.listByUserAndRange(user.id, start.toISOString().slice(0,10), end.toISOString().slice(0,10))
    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
