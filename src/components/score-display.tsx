import { Flame } from 'lucide-react'

interface ScoreDisplayProps {
  currentScore: number
  totalScore: number
  streakDays: number
}

export function ScoreDisplay({ currentScore, totalScore, streakDays }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-dark">Pontuação</h2>
      <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-6">
        <div className="text-center p-4 rounded-xl bg-pink-50 border border-pink-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Hoje</h3>
          <div className="text-3xl md:text-4xl font-bold text-pink-burnt">{currentScore}/7</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-pink-100 border border-pink-300">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Total</h3>
          <div className="text-3xl md:text-4xl font-bold text-pink-burnt">{totalScore}</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-pink-200 border border-pink-400">
          <h3 className="text-lg font-semibold mb-2 text-gray-dark">Dias</h3>
          <div className="text-3xl md:text-4xl font-bold text-pink-burnt">{streakDays}</div>
        </div>
      </div>
    </div>
  )
}
