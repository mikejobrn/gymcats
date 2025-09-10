'use client'

import { useState } from 'react'

interface SimpleActivityButtonsProps {
  onActivityToggle: (type: 'WATER' | 'RESISTANCE' | 'CARDIO') => void
  completedActivities: {
    water: boolean
    resistance: boolean
    cardio: boolean
  }
  activityTimes?: Record<'WATER'|'RESISTANCE'|'CARDIO', string | Date | undefined>
}

export function SimpleActivityButtons({ onActivityToggle, completedActivities, activityTimes }: SimpleActivityButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const activities = [
    {
      type: 'WATER' as const,
      label: 'Água',
      emoji: '💧',
      completed: completedActivities.water,
      description: 'Marcar como bebida'
    },
    {
      type: 'RESISTANCE' as const, 
      label: 'Resistência',
      emoji: '💪',
      completed: completedActivities.resistance,
      description: 'Marcar treino feito'
    },
    {
      type: 'CARDIO' as const,
      label: 'Cardio', 
      emoji: '🏃',
      completed: completedActivities.cardio,
      description: 'Marcar cardio feito'
    }
  ]

  const handleActivityClick = async (type: 'WATER' | 'RESISTANCE' | 'CARDIO') => {
    setIsLoading(type)
    try {
      await onActivityToggle(type)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6" style={{color: '#000000'}}>
        Marcar Atividades de Hoje
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <button
            key={activity.type}
            onClick={() => handleActivityClick(activity.type)}
            disabled={isLoading === activity.type}
            className={`
              p-6 rounded-xl border-2 transition-all duration-200 
              flex flex-col items-center gap-3 text-center
              ${activity.completed 
                ? 'border-pink-burnt bg-pink-pastel text-pink-burnt' 
                : 'border-gray-300 hover:border-pink-medium hover:bg-pink-50'
              }
              ${isLoading === activity.type ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
            style={{
              borderColor: activity.completed ? '#E75480' : '#333333',
              color: activity.completed ? '#E75480' : '#000000'
            }}
          >
            <div className="text-4xl mb-2">{activity.emoji}</div>
            <div className="font-semibold text-lg">{activity.label}</div>
            <div className="text-sm opacity-80">
              {isLoading === activity.type ? 'Processando...' : activity.description}
            </div>
            {activity.completed && (
              <div className="text-xs font-bold text-pink-burnt">
                ✅ FEITO HOJE
                {activityTimes && activityTimes[activity.type] && (
                  <span className="block mt-1">
                    {typeof activityTimes[activity.type] === 'string'
                      ? new Date(activityTimes[activity.type]!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      : (activityTimes[activity.type] as Date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{color: '#666666'}}>
          Clique nos botões acima para marcar suas atividades como concluídas hoje
        </p>
      </div>
    </div>
  )
}
