import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '@/components/dashboard-client'
import { getBrazilDate, getStartOfDay, getEndOfDay } from '@/lib/date-utils'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get user data using Brazil timezone
  const now = getBrazilDate()
  const startOfToday = getStartOfDay(now)
  const endOfToday = getEndOfDay(now)

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
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

  if (!user) {
    redirect('/auth/signin')
  }

  // Find today's score using Brazil date
  const todayBrazil = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayScore = user.dailyScores.find(score => {
    const scoreDate = new Date(score.date.getFullYear(), score.date.getMonth(), score.date.getDate())
    return scoreDate.getTime() === todayBrazil.getTime()
  })

  return (
    <DashboardClient 
      user={user}
      todayScore={todayScore}
      todayActivities={user.activityLogs}
    />
  )
}
