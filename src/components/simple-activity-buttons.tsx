'use client'

import React, { useState } from 'react'
import { Droplets, Dumbbell, Heart } from 'lucide-react'
import { format } from 'date-fns'

interface SimpleActivityButtonsProps {
  onActivityToggle: (type: 'WATER' | 'RESISTANCE' | 'CARDIO') => void
  completedActivities: {
    water: boolean
    resistance: boolean
    cardio: boolean
  }
  activityTimes?: Record<'WATER'|'RESISTANCE'|'CARDIO', string | Date | undefined>
  initialActivityTimes?: Record<'WATER'|'RESISTANCE'|'CARDIO', string | undefined>
}

export function SimpleActivityButtons({ onActivityToggle, completedActivities, activityTimes, initialActivityTimes }: SimpleActivityButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const activities = [
    {
      type: 'WATER' as const,
      label: 'Água',
      icon: Droplets,
      bgColorClass: 'bg-blue-500',
      bgHoverClass: 'hover:bg-blue-400',
      colorClass: 'text-blue-100',
      completed: completedActivities.water,
    },
    {
      type: 'RESISTANCE' as const, 
      label: 'Resistência',
      icon: Dumbbell,
      bgColorClass: 'bg-purple-500',
      bgHoverClass: 'hover:bg-purple-400',
      colorClass: 'text-purple-100',
      completed: completedActivities.resistance,
    },
    {
      type: 'CARDIO' as const,
      label: 'Cardio', 
      icon: Heart,
      bgColorClass: 'bg-red-500',
      bgHoverClass: 'hover:bg-red-400',
      colorClass: 'text-red-100',
      completed: completedActivities.cardio,
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
              flex flex-row items-center gap-3 text-center
              ${activity.completed 
                ? `border-green-600 bg-white shadow-lg` 
                : `border-gray-medium ${activity.bgColorClass} hover:border-pink-medium ${activity.bgHoverClass} shadow-lg`
              }
              ${isLoading === activity.type ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            <div className={`mb-2 ${activity.colorClass}`}>
              {React.createElement(activity.icon, { 
                className: `w-8 h-8 md:w-10 md:h-10 mx-auto ${activity.completed ? 'text-green-600' : ''}` 
              })}
            </div>
            <div className={`font-semibold text-lg ${activity.completed ? 'text-green-600' : activity.colorClass}`}>
              {activity.label}
            </div>
            {activity.completed && (
              <div className="font-semibold text-lg text-green-600 ml-auto">
                {(
                  // Prefer server-provided preformatted time string to avoid hydration mismatch
                  (initialActivityTimes && initialActivityTimes[activity.type])
                  || (activityTimes && activityTimes[activity.type] && (
                    // If the activity time is a Date or ISO string, format it on the client using HH:mm in user's locale
                    typeof activityTimes[activity.type] === 'string'
                      ? format(new Date(activityTimes[activity.type]!), 'HH:mm')
                      : format(activityTimes[activity.type] as Date, 'HH:mm')
                  ))
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
