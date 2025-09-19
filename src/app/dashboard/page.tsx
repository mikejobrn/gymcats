import { PainelClient } from '@/components/painel-client'
import { authOptions } from '@/lib/auth'
import { createUserRepository } from '@/app/providers'
import { isSameDay } from 'date-fns'
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

  // Debug logs removed

  const userRepo = createUserRepository()
  const user = await userRepo.findByEmailWithRelations(session.user?.email ?? '')

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
