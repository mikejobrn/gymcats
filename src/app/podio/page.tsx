'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface RankingUser {
  id: string
  name: string | null
  email: string
  totalScore: number
  streakDays: number
  rank: number
  createdAt: string
}

interface PodiumData {
  ranking: RankingUser[]
  currentUser: string
}

export default function PodioPage() {
  const { data: session } = useSession()
  const [podiumData, setPodiumData] = useState<PodiumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchPodiumData()
    }
  }, [session])

  const fetchPodiumData = async () => {
    try {
      const response = await fetch('/api/podium')
      if (!response.ok) {
        throw new Error('Erro ao carregar ranking')
      }
      const data = await response.json()
      setPodiumData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-blue-100 to-blue-200'
    }
  }

  const isCurrentUser = (userEmail: string) => {
    return session?.user?.email === userEmail.replace(/(.{2})(.*)(@.*)/, '$1$2$3')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erro</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!podiumData?.ranking.length) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">🏆 Pódio GymCats</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">😸</div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Ainda não há gatinhas no pódio!
          </h2>
          <p className="text-yellow-600">
            Seja a primeira a completar atividades e conquiste o topo do ranking!
          </p>
        </div>
      </div>
    )
  }

  const topThree = podiumData.ranking.slice(0, 3)
  const others = podiumData.ranking.slice(3)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Pódio GymCats</h1>
      
      {/* Top 3 Pódio Visual */}
      {topThree.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-center items-end space-x-4 mb-8">
            {/* 2º Lugar */}
            {topThree[1] && (
              <div className="text-center">
                <div className={`w-24 h-32 bg-gradient-to-b ${getMedalColor(2)} rounded-t-lg flex flex-col justify-end items-center p-2 border-2 border-gray-300`}>
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="text-sm font-bold text-gray-700">2º</div>
                </div>
                <div className="mt-2 text-center">
                  <div className="font-semibold text-sm truncate w-24">
                    {topThree[1].name || 'Gatinha Anônima'}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {topThree[1].totalScore}pts
                  </div>
                  <div className="text-orange-500 text-xs">
                    🔥 {topThree[1].streakDays} dias
                  </div>
                </div>
              </div>
            )}

            {/* 1º Lugar */}
            <div className="text-center">
              <div className={`w-28 h-40 bg-gradient-to-b ${getMedalColor(1)} rounded-t-lg flex flex-col justify-end items-center p-2 border-4 border-yellow-400 shadow-lg`}>
                <div className="text-3xl mb-1">👑</div>
                <div className="text-lg font-bold text-yellow-800">1º</div>
              </div>
              <div className="mt-2 text-center">
                <div className="font-bold text-base truncate w-28">
                  {topThree[0].name || 'Gatinha Anônima'}
                </div>
                <div className="text-blue-600 font-bold text-lg">
                  {topThree[0].totalScore}pts
                </div>
                <div className="text-orange-500 text-sm">
                  🔥 {topThree[0].streakDays} dias
                </div>
              </div>
            </div>

            {/* 3º Lugar */}
            {topThree[2] && (
              <div className="text-center">
                <div className={`w-24 h-28 bg-gradient-to-b ${getMedalColor(3)} rounded-t-lg flex flex-col justify-end items-center p-2 border-2 border-orange-400`}>
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="text-sm font-bold text-orange-700">3º</div>
                </div>
                <div className="mt-2 text-center">
                  <div className="font-semibold text-sm truncate w-24">
                    {topThree[2].name || 'Gatinha Anônima'}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {topThree[2].totalScore}pts
                  </div>
                  <div className="text-orange-500 text-xs">
                    🔥 {topThree[2].streakDays} dias
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista Completa do Ranking */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">Ranking Completo</h2>
        
        {podiumData.ranking.map((user) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              isCurrentUser(user.email)
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300'
                : user.rank <= 3
                ? 'bg-gradient-to-r ' + getMedalColor(user.rank) + ' border-transparent'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${
                user.rank <= 3 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getMedalIcon(user.rank)}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {user.name || 'Gatinha Anônima'}
                  </h3>
                  {isCurrentUser(user.email) && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      Você
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {user.totalScore} pts
              </div>
              <div className="text-sm text-orange-500 flex items-center justify-end space-x-1">
                <span>🔥</span>
                <span>{user.streakDays} dias</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Motivação para usuários sem pontos */}
      {podiumData.ranking.length < 10 && (
        <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <div className="text-4xl mb-3">💪</div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Conquiste seu lugar no pódio!
          </h3>
          <p className="text-purple-600">
            Complete suas atividades diárias e apareça no ranking das gatinhas mais dedicadas!
          </p>
        </div>
      )}
    </div>
  )
}
