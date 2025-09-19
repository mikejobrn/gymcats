import { NextRequest, NextResponse } from 'next/server'
import { createUserRepository } from '@/app/providers'
import { RegisterUserUseCase } from '@/core/usecases/register-user'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const userRepo = createUserRepository()
    const register = new RegisterUserUseCase(userRepo)

    try {
      const user = await register.execute({ email, password, name })
      return NextResponse.json(
        { message: 'Usuário criado com sucesso', userId: user.id },
        { status: 201 }
      )
    } catch (err: unknown) {
      if (err instanceof Error && err?.message === 'USER_EXISTS') {
        return NextResponse.json(
          { error: 'Usuário já existe com este email' },
          { status: 400 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
