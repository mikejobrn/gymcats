'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isRegister) {
        // Registrar usuário
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          // Login após registro
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          if (result?.ok) {
            router.push('/dashboard')
          } else {
            setError('Erro ao fazer login após registro')
          }
        } else {
          const data = await response.json()
          setError(data.error || 'Erro ao criar conta')
        }
      } else {
        // Login
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/dashboard')
        } else {
          setError('Email ou senha incorretos')
        }
      }
    } catch (error) {
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-pastel via-white to-pink-pastel flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Cat Logo Placeholder */}
          <div className="w-24 h-24 mx-auto mb-4 bg-pink-burnt rounded-full flex items-center justify-center cat-bounce">
            <span className="text-4xl">🐱</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: '#000000'}}>
            Gymcats
          </h1>
          <p style={{color: '#000000'}}>
            Transforme seus hábitos em uma aventura felina!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-50 font-semibold"
            style={{borderColor: '#000000', color: '#000000'}}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Entrando...' : '🌐 Entrar com Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 py-1 bg-white border-2 border-gray-300 rounded-lg font-medium" style={{color: '#000000'}}>
                ou use seu email
              </span>
            </div>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-burnt"
                style={{
                  borderColor: '#000000', 
                  color: '#000000',
                  backgroundColor: '#FFFFFF'
                }}
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-burnt"
              style={{
                borderColor: '#000000', 
                color: '#000000',
                backgroundColor: '#FFFFFF'
              }}
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-burnt"
              style={{
                borderColor: '#000000', 
                color: '#000000',
                backgroundColor: '#FFFFFF'
              }}
            />

            {error && (
              <div 
                className="text-red-500 text-sm text-center font-semibold p-3 rounded-lg"
                style={{
                  backgroundColor: '#FFF0F0',
                  color: '#DC2626',
                  border: '2px solid #DC2626'
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-burnt text-white rounded-xl py-3 px-4 hover:bg-pink-hot transition-colors disabled:opacity-50 font-semibold"
              style={{
                backgroundColor: isLoading ? '#666' : '#FF6B9D', 
                color: '#FFFFFF',
                border: '2px solid #000000'
              }}
            >
              {isLoading ? 'Processando...' : (isRegister ? '✅ Criar Conta' : '🔑 Entrar com Email e Senha')}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-pink-burnt hover:underline text-sm font-semibold"
              style={{
                color: '#FF6B9D',
                backgroundColor: '#FFFFFF',
                padding: '8px 16px',
                border: '2px solid #FF6B9D',
                borderRadius: '8px'
              }}
            >
              {isRegister ? '📝 Já tem conta? Entrar' : '🆕 Não tem conta? Criar'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{color: '#000000'}}>
            Ao entrar, você concorda com nossos{' '}
            <a href="#" className="text-pink-burnt hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-pink-burnt hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
