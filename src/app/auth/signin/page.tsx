'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Cat, CheckCircle, Key, FileText, UserPlus } from 'lucide-react'

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
  await signIn('google', { callbackUrl: '/painel' })
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
            router.push('/painel')
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
          router.push('/painel')
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
            <Cat className="w-12 h-12 text-pink-burnt" />
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
            <Globe className="w-5 h-5" />
            {isLoading ? 'Entrando...' : 'Entrar com Google'}
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
              {isLoading ? 'Processando...' : (isRegister ? (
                <><CheckCircle className="w-4 h-4 inline mr-2" />Criar Conta</>
              ) : (
                <><Key className="w-4 h-4 inline mr-2" />Entrar com Email e Senha</>
              ))}
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
              {isRegister ? (
                <><FileText className="w-4 h-4 inline mr-2" />Já tem conta? Entrar</>
              ) : (
                <><UserPlus className="w-4 h-4 inline mr-2" />Não tem conta? Criar</>
              )}
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
