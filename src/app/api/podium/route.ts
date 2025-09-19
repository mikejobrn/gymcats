import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prisma } = await import('@/lib/prisma')
    
    // Buscar todos os usuários ordenados por pontuação total (descrescente)
    const users = await prisma.user.findMany({
      where: {
        totalScore: {
          gt: 0 // Só mostrar usuários com pontuação maior que 0
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        totalScore: true,
        streakDays: true,
        createdAt: true,
      },
      orderBy: [
        { totalScore: 'desc' },
        { streakDays: 'desc' },
        { createdAt: 'asc' } // Em caso de empate, usuário mais antigo fica na frente
      ],
      take: 50 // Limitar a 50 primeiros usuários
    })

    // Adicionar posição no ranking
    const ranking = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      // Mascarar email parcialmente para privacidade
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    }))

    return NextResponse.json({ ranking, currentUser: session.user.email })

  } catch (error) {
    console.error('Error fetching podium ranking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}