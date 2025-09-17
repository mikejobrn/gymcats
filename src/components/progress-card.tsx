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
      bg: 'bg-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-600',
      lightBg: 'bg-blue-50'
    },
    purple: {
      bg: 'bg-purple-600',
      text: 'text-purple-700',
      border: 'border-purple-600',
      lightBg: 'bg-purple-50'
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-green-700',
      border: 'border-green-600',
      lightBg: 'bg-green-50'
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 md:p-6 border-l-4 transition-all duration-200 hover:shadow-xl ${
      completed ? `${colorClasses[color].border} ${colorClasses[color].lightBg}` : 'border-gray-medium'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-dark pr-2">{title}</h3>
        {completed && (
          <span className="text-2xl flex-shrink-0">✅</span>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xl md:text-2xl font-bold text-gray-dark">
            {current.toFixed(1)} {unit}
          </span>
          <span className="text-sm text-gray-medium">
            meta: {target} {unit}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              completed ? colorClasses[color].bg : 'bg-gray-medium'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-dark font-medium">
            {progress.toFixed(0)}% completo
          </span>
          <span className={`font-semibold px-2 py-1 rounded-full ${
            completed 
              ? `${colorClasses[color].text} ${colorClasses[color].lightBg}` 
              : 'text-gray-dark bg-gray-100'
          }`}>
            +{points} pts
          </span>
        </div>
      </div>
    </div>
  )
}
