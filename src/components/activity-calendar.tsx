'use client'

import { useState, useEffect } from 'react'

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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold" style={{color: '#000000'}}>
          Calendário de Atividades
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{color: '#000000'}}
          >
            ← Anterior
          </button>
          <span className="text-lg font-medium min-w-48 text-center" style={{color: '#000000'}}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{color: '#000000'}}
          >
            Próximo →
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p style={{color: '#666666'}}>Carregando calendário...</p>
        </div>
      ) : (
        <>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center p-2 font-medium text-sm" style={{color: '#666666'}}>
                {day}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2"></div>
              }

              const activity = getActivityForDate(day)
              const isCurrentDay = isToday(day)
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    p-2 min-h-16 border rounded-lg transition-all hover:shadow-md
                    ${isCurrentDay ? 'border-pink-burnt bg-pink-pastel' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="text-sm font-medium mb-1" style={{color: isCurrentDay ? '#E75480' : '#000000'}}>
                    {day.getDate()}
                  </div>
                  
                  {activity && (
                    <div className="flex flex-wrap gap-1">
                      {activity.waterCompleted && (
                        <span className="text-xs">💧</span>
                      )}
                      {activity.resistanceCompleted && (
                        <span className="text-xs">💪</span>
                      )}
                      {activity.cardioCompleted && (
                        <span className="text-xs">🏃</span>
                      )}
                      {activity.totalScore > 0 && (
                        <div className="text-xs text-pink-burnt font-bold">
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
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2" style={{color: '#000000'}}>Legenda:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>💧</span>
                <span style={{color: '#666666'}}>Água</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💪</span>
                <span style={{color: '#666666'}}>Resistência</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏃</span>
                <span style={{color: '#666666'}}>Cardio</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-pink-pastel border border-pink-burnt rounded"></span>
                <span style={{color: '#666666'}}>Hoje</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
