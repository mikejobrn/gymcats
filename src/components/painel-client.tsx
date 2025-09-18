'use client'

import { ScoreDisplay } from '@/components/score-display'
import { SimpleActivityButtons } from '@/components/simple-activity-buttons'
import { useState } from 'react'

import { ActivityLog, DailyScore, User } from '@prisma/client'

interface UserWithRelations extends User {
  dailyScores: DailyScore[]
  activityLogs: ActivityLog[]
}

interface PainelClientProps {
  user: UserWithRelations
  todayScore: DailyScore | undefined
  todayActivities: ActivityLog[]
}

export function PainelClient({ user, todayScore, todayActivities }: PainelClientProps) {
  const [currentScore, setCurrentScore] = useState(todayScore?.score ?? 0)
  const [completedActivities, setCompletedActivities] = useState({
    water: todayScore?.waterCompleted ?? false,
    resistance: todayScore?.resistanceCompleted ?? false,
    cardio: todayScore?.cardioCompleted ?? false
  })
  const [localTodayActivities, setLocalTodayActivities] = useState<ActivityLog[]>(todayActivities)

  const handleActivityToggle = async (type: 'WATER' | 'RESISTANCE' | 'CARDIO') => {
    console.log('=== INICIO handleActivityToggle ===')
    console.log('Type:', type)
    console.log('Estado atual completedActivities:', completedActivities)
    
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })

      console.log('POST response status:', response.status)

      if (response.ok) {
        const postResult = await response.json()
        console.log('POST result completo:', postResult)
        
        // Usar o estado atualizado diretamente da resposta do POST
        if (postResult.updatedScore) {
          const newCompletedActivities = {
            water: postResult.updatedScore.waterCompleted ?? false,
            resistance: postResult.updatedScore.resistanceCompleted ?? false,
            cardio: postResult.updatedScore.cardioCompleted ?? false
          }
          console.log('Estado atualizado diretamente da resposta POST:', newCompletedActivities)
          setCompletedActivities(newCompletedActivities)
          setCurrentScore(postResult.updatedScore.score ?? 0)
        }
        
        // Buscar atividades do dia do backend para atualizar a lista
        const today = new Date()
        const todayBrazil = new Date(today.getTime() - 3 * 60 * 60 * 1000)
        const dateStr = todayBrazil.toISOString().split('T')[0]
        console.log('Buscando atividades para data:', dateStr)
        
        const activitiesRes = await fetch(`/api/activities/logs?date=${dateStr}&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (activitiesRes.ok) {
          const { activities } = await activitiesRes.json()
          console.log('Atividades retornadas:', activities)
          setLocalTodayActivities(activities)
        }
      } else {
        console.error('Erro ao registrar atividade - status:', response.status);
        const errorText = await response.text()
        console.error('Erro details:', errorText)
      }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
    
    console.log('=== FIM handleActivityToggle ===')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-pastel via-white to-pink-pastel pt-8 md:pt-0">
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
