interface ScoreDisplayProps {
  currentScore: number
  totalScore: number
  streakDays: number
}

export function ScoreDisplay({ currentScore, totalScore, streakDays }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{color: '#000000'}}>Pontos de Hoje</h3>
          <div className="text-4xl font-bold text-pink-burnt">{currentScore}</div>
          <div className="text-sm" style={{color: '#000000'}}>de 7 possíveis</div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{color: '#000000'}}>Total Geral</h3>
          <div className="text-4xl font-bold text-pink-medium">{totalScore}</div>
          <div className="text-sm" style={{color: '#000000'}}>pontos acumulados</div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{color: '#000000'}}>Sequência</h3>
          <div className="text-4xl font-bold text-pink-hot">{streakDays}</div>
          <div className="text-sm" style={{color: '#000000'}}>dias consecutivos</div>
        </div>
      </div>
      
      {streakDays >= 3 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-pink-pastel to-pink-medium rounded-lg text-center">
          <span className="text-2xl">🔥</span>
          <p className="font-semibold mt-2" style={{color: '#FFFFFF'}}>
            {streakDays >= 5 ? 'Gatinha em chamas! 5+ dias!' : 'Sequência incrível! 3+ dias!'}
          </p>
        </div>
      )}
    </div>
  )
}
