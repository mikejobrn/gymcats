interface ProgressCardProps {
  title: string
  current: number
  target: number
  unit: string
  points: number
  completed: boolean
  color: 'blue' | 'purple' | 'green'
}

export function ProgressCard({ 
  title, 
  current, 
  target, 
  unit, 
  points, 
  completed, 
  color 
}: ProgressCardProps) {
  const progress = Math.min((current / target) * 100, 100)
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-500'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      border: 'border-purple-500'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-500'
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${completed ? colorClasses[color].border : 'border-gray-dark'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-dark">{title}</h3>
        {completed && (
          <span className="text-2xl">✅</span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-dark">
            {current.toFixed(1)} {unit}
          </span>
          <span className="text-sm text-gray-dark">
            meta: {target} {unit}
          </span>
        </div>
        
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              completed ? colorClasses[color].bg : 'bg-gray-dark'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-dark">
            {progress.toFixed(0)}% completo
          </span>
          <span className={`text-sm font-semibold ${completed ? colorClasses[color].text : 'text-gray-dark'}`}>
            +{points} pts
          </span>
        </div>
      </div>
    </div>
  )
}
