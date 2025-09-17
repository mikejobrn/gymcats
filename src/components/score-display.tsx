import { Flame } from 'lucide-react'

interface ScoreDisplayProps {
  currentScore: number
  totalScore: number
  streakDays: number
}

export function ScoreDisplay({ currentScore, totalScore, streakDays }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-center p-4 rounded-xl bg-pink-50 border border-pink-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Pontos de Hoje</h3>
          <div className="text-3xl md:text-4xl font-bold text-pink-burnt">{currentScore}</div>
          <div className="text-sm text-gray-medium">de 7 possíveis</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Total Geral</h3>
          <div className="text-3xl md:text-4xl font-bold text-blue-600">{totalScore}</div>
          <div className="text-sm text-gray-medium">pontos acumulados</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Sequência</h3>
          <div className="text-3xl md:text-4xl font-bold text-orange-600">{streakDays}</div>
          <div className="text-sm text-gray-medium">dias consecutivos</div>
        </div>
      </div>
      
      {streakDays >= 3 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-pink-burnt to-pink-hot rounded-xl text-center shadow-md">
          <Flame className="w-8 h-8 text-white mx-auto" />
          <p className="font-semibold mt-2 text-white text-lg">
            {streakDays >= 5 ? 'Gatinha em chamas! 5+ dias!' : 'Sequência incrível! 3+ dias!'}
          </p>
        </div>
      )}
    </div>
  )
}
