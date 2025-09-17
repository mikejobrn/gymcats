'use client'

import { useState, useEffect } from 'react'
import { Droplets, Dumbbell, Heart } from 'lucide-react'

interface CalendarProps {
  userId: string
}

interface DayActivity {
  date: string
  waterCompleted: boolean
  resistanceCompleted: boolean
  cardioCompleted: boolean
  totalScore: number
}

export function ActivityCalendar({ userId }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthActivities, setMonthActivities] = useState<DayActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMonthActivities()
  }, [currentDate, userId])

  const fetchMonthActivities = async () => {
    setIsLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      
      const response = await fetch(`/api/activities/calendar?year=${year}&month=${month}&userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMonthActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Erro ao buscar atividades do calendário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias vazios do início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getActivityForDate = (date: Date): DayActivity | undefined => {
    const dateString = date.toISOString().split('T')[0]
    return monthActivities.find(activity => activity.date === dateString)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-dark">
          Calendário de Atividades
        </h3>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-dark flex-shrink-0"
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline ml-1">Anterior</span>
          </button>
          <span className="text-base sm:text-lg font-medium text-center text-gray-dark flex-1 sm:min-w-48">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-dark flex-shrink-0"
          >
            <span className="hidden sm:inline mr-1">Próximo</span>
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-medium">Carregando calendário...</p>
        </div>
      ) : (
        <>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center p-1 sm:p-2 font-medium text-xs sm:text-sm text-gray-medium">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.substring(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-1 sm:p-2"></div>
              }

              const activity = getActivityForDate(day)
              const isCurrentDay = isToday(day)
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    p-1 sm:p-2 min-h-12 sm:min-h-16 border rounded-lg transition-all hover:shadow-md text-center
                    ${isCurrentDay 
                      ? 'border-pink-burnt bg-pink-pastel border-2' 
                      : 'border-gray-300 hover:border-pink-medium bg-white'
                    }
                  `}
                >
                  <div className={`text-xs sm:text-sm font-medium mb-1 ${
                    isCurrentDay ? 'text-pink-burnt font-bold' : 'text-gray-dark'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {activity && (
                    <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
                      {activity.waterCompleted && (
                        <Droplets className="w-3 h-3 text-blue-500" />
                      )}
                      {activity.resistanceCompleted && (
                        <Dumbbell className="w-3 h-3 text-purple-500" />
                      )}
                      {activity.cardioCompleted && (
                        <Heart className="w-3 h-3 text-red-500" />
                      )}
                      {activity.totalScore > 0 && (
                        <div className="text-xs text-pink-burnt font-bold w-full">
                          {activity.totalScore}pts
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="mt-6 p-4 bg-gray-light rounded-lg">
            <h4 className="text-sm font-medium mb-3 text-gray-dark">Legenda:</h4>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-gray-dark">Água</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-500" />
                <span className="text-gray-dark">Resistência</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-gray-dark">Cardio</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <span className="w-4 h-4 bg-pink-pastel border-2 border-pink-burnt rounded"></span>
                <span className="text-gray-dark">Hoje</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
