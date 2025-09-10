'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
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
  const [currentScore, setCurrentScore] = useState(todayScore?.score || 0)
  const [completedActivities, setCompletedActivities] = useState({
    water: todayScore?.waterCompleted || false,
    resistance: todayScore?.resistanceCompleted || false,
    cardio: todayScore?.cardioCompleted || false
  })

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
        // Recarregar a página para pegar dados atualizados
        window.location.reload()
      } else {
        console.error('Erro ao registrar atividade')
      }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-pastel via-white to-pink-pastel">
      <header className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-burnt rounded-full flex items-center justify-center cat-bounce">
              <span className="text-2xl">🐱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{color: '#000000'}}>Gymcats</h1>
              <p className="text-sm" style={{color: '#000000'}}>Olá, {user.name}!</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm hover:text-pink-burnt transition-colors"
            style={{color: '#000000'}}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ScoreDisplay 
          currentScore={currentScore}
          totalScore={user.totalScore}
          streakDays={user.streakDays}
        />

        <SimpleActivityButtons 
          onActivityToggle={handleActivityToggle}
          completedActivities={completedActivities}
        />

        {todayActivities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4" style={{color: '#000000'}}>
              Atividades Marcadas Hoje
            </h3>
            <div className="space-y-3">
              {todayActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {activity.type === 'WATER' ? '💧' : 
                       activity.type === 'RESISTANCE' ? '💪' : '🏃'}
                    </span>
                    <div>
                      <p className="font-medium" style={{color: '#000000'}}>
                        {activity.type === 'WATER' ? 'Água' : 
                         activity.type === 'RESISTANCE' ? 'Resistência' : 'Cardio'}
                      </p>
                      <p className="text-sm" style={{color: '#000000'}}>
                        {activity.completed ? 'Concluído' : 'Não concluído'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm" style={{color: '#000000'}}>
                      {new Date(activity.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {activity.completed && (
                      <span className="text-xs text-pink-burnt font-bold">✅ FEITO</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendário de Atividades */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{color: '#000000'}}>
            Calendário de Atividades
          </h3>
          <ActivityCalendar userId={user.id} />
        </div>
      </main>
    </div>
  )
}
