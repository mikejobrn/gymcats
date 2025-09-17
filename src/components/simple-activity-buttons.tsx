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
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-dark">
        Marcar Atividades de Hoje
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <button
            key={activity.type}
            onClick={() => handleActivityClick(activity.type)}
            disabled={isLoading === activity.type}
            className={`
              p-4 md:p-6 rounded-xl border-2 transition-all duration-200 
              flex flex-col items-center gap-3 text-center
              ${activity.completed 
                ? 'border-pink-burnt bg-pink-pastel shadow-md' 
                : 'border-gray-medium bg-white hover:border-pink-medium hover:bg-pink-50 hover:shadow-md'
              }
              ${isLoading === activity.type ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            <div className="text-3xl md:text-4xl mb-2">{activity.emoji}</div>
            <div className="font-semibold text-lg text-gray-dark">{activity.label}</div>
            <div className={`text-sm ${activity.completed ? 'text-pink-burnt' : 'text-gray-medium'}`}>
              {isLoading === activity.type ? 'Processando...' : activity.description}
            </div>
            {activity.completed && (
              <div className="text-xs font-bold text-pink-burnt bg-white/80 px-3 py-1 rounded-full">
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
        <p className="text-sm text-gray-medium">
          Clique nos botões acima para marcar suas atividades como concluídas hoje
        </p>
      </div>
    </div>
  )
}
