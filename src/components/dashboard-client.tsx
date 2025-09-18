'use client'

import { useState, useRef } from 'react'
import { SimpleActivityButtons } from '@/components/simple-activity-buttons'
import { ScoreDisplay } from '@/components/score-display'
import { ActivityCalendar } from '@/components/activity-calendar'

import { User, DailyScore, ActivityLog } from '@prisma/client'

interface UserWithRelations extends User {
  dailyScores: DailyScore[]
  activityLogs: ActivityLog[]
}

interface DashboardClientProps {
  user: UserWithRelations
  todayScore: DailyScore | undefined
  todayActivities: ActivityLog[]
}

export function DashboardClient({ user, todayScore, todayActivities }: DashboardClientProps) {
  const [currentScore, setCurrentScore] = useState(todayScore?.score ?? 0)
  const [completedActivities, setCompletedActivities] = useState({
    water: todayScore?.waterCompleted ?? false,
    resistance: todayScore?.resistanceCompleted ?? false,
    cardio: todayScore?.cardioCompleted ?? false
  })
  const [localTodayActivities, setLocalTodayActivities] = useState<ActivityLog[]>(todayActivities)

  const handleActivityToggle = async (type: 'WATER' | 'RESISTANCE' | 'CARDIO') => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        // Buscar dados atualizados do usuário e score do dia
        const userScoreRes = await fetch('/api/activities')
        if (userScoreRes.ok) {
          const { todayScore, totalScore, streakDays } = await userScoreRes.json()
          setCurrentScore(todayScore?.score ?? 0)
          setCompletedActivities({
            water: todayScore?.waterCompleted ?? false,
            resistance: todayScore?.resistanceCompleted ?? false,
            cardio: todayScore?.cardioCompleted ?? false
          })
          user.totalScore = totalScore
          user.streakDays = streakDays
        }
        // Buscar atividades do dia do backend
        const today = new Date()
        const activitiesRes = await fetch(`/api/activities/logs?date=${today.toISOString().split('T')[0]}`)
        if (activitiesRes.ok) {
          const { activities } = await activitiesRes.json()
          setLocalTodayActivities(activities)
        }
      } else {
        console.error('Erro ao registrar atividade');
      }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-pastel via-white to-pink-pastel">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ScoreDisplay 
          currentScore={currentScore}
          totalScore={user.totalScore}
          streakDays={user.streakDays}
        />

        <SimpleActivityButtons 
          onActivityToggle={handleActivityToggle}
          completedActivities={completedActivities}
          activityTimes={localTodayActivities.reduce((acc, act) => {
            if (act.completed) acc[act.type] = act.date;
            return acc;
          }, {} as Record<'WATER'|'RESISTANCE'|'CARDIO', string | Date | undefined>)}
        />
      </main>
    </div>
  )
}
