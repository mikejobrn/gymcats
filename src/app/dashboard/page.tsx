import { PainelClient } from '@/components/painel-client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { endOfDay, isSameDay, startOfDay } from 'date-fns'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Painel() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Adjust for Brazil timezone (UTC-3)
  const nowUTC = new Date()
  const nowBrazil = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000) // Subtract 3 hours
  const startOfToday = startOfDay(nowBrazil)
  const endOfToday = endOfDay(nowBrazil)

  // Debug logs removed

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? '' },
    include: {
      dailyScores: {
        orderBy: { date: 'desc' },
        take: 7
      },
      activityLogs: {
        where: {
          date: {
            gte: startOfToday,
            lte: endOfToday
          }
        },
        orderBy: { date: 'desc' }
      }
    }
  })

  // Debug logs removed

  if (!user) {
    redirect('/auth/signin')
  }

  // Find today's score - compare with Brazil date
  const todayScore = user.dailyScores.find(score => isSameDay(score.date, nowBrazil))

  // Debug logs removed

  return (
  <PainelClient 
      user={user}
      todayScore={todayScore}
      todayActivities={user.activityLogs}
    />
  )
}
