import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Verificar se usuário de teste já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'teste@gymcats.app'
      }
    })

    if (existingUser) {
      console.log('✅ Usuário de teste já existe')
      console.log('Email: teste@gymcats.app')
      console.log('Senha: teste123')
      return
    }

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('teste123', 12)
    
    const testUser = await prisma.user.create({
      data: {
        email: 'teste@gymcats.app',
        name: 'Gatinha Teste',
        hashedPassword,
        totalScore: 0,
        streakDays: 0,
      }
    })

    console.log('✅ Usuário de teste criado com sucesso!')
    console.log('Email: teste@gymcats.app')
    console.log('Senha: teste123')
    console.log('ID:', testUser.id)
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
