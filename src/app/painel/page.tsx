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

  console.log('Current time UTC:', nowUTC)
  console.log('Current time Brazil:', nowBrazil)
  console.log('Start of today Brazil:', startOfToday)
  console.log('End of today Brazil:', endOfToday)

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

  console.log('User fetched for painel:', user)

  if (!user) {
    redirect('/auth/signin')
  }

  // Find today's score - compare with Brazil date
  const todayScore = user.dailyScores.find(score => {
    console.log('Checking score date (Brazil):', score.date, 'against today (Brazil):', nowBrazil)
    return isSameDay(score.date, nowBrazil);
  })

  console.log('Today\'s score:', todayScore)

  return (
  <PainelClient 
      user={user}
      todayScore={todayScore}
      todayActivities={user.activityLogs}
    />
  )
}
