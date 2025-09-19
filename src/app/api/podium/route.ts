import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaUserRepository } from '@/core/adapters/prisma/prisma-user-repo'
import { GetRankingUseCase } from '@/core/usecases/get-ranking'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const userRepo = new PrismaUserRepository()
  const usecase = new GetRankingUseCase(userRepo)
  const ranking = await usecase.execute(50)

    return NextResponse.json({ ranking, currentUser: session.user.email })

  } catch (error) {
    console.error('Error fetching podium ranking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}