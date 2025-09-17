import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addPointsToTestUser() {
  try {
    // Buscar usuário de teste
    const user = await prisma.user.findUnique({
      where: {
        email: 'teste@gymcats.app'
      }
    })

    if (!user) {
      console.log('❌ Usuário de teste não encontrado')
      return
    }

    // Atualizar pontuação total do usuário
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        totalScore: 150,
        streakDays: 7
      }
    })

    // Criar alguns outros usuários de exemplo para popular o pódio
    const exampleUsers = [
      {
        name: 'Gatinha Campeã',
        email: 'campea@gymcats.app',
        totalScore: 300,
        streakDays: 15
      },
      {
        name: 'Gatinha Forte',
        email: 'forte@gymcats.app',
        totalScore: 200,
        streakDays: 10
      },
      {
        name: 'Gatinha Dedicada',
        email: 'dedicada@gymcats.app',
        totalScore: 100,
        streakDays: 5
      },
      {
        name: 'Gatinha Iniciante',
        email: 'iniciante@gymcats.app',
        totalScore: 50,
        streakDays: 3
      }
    ]

    for (const userData of exampleUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            ...userData,
            hashedPassword: '$2a$12$dummyhash' // Hash dummy
          }
        })
        console.log(`✅ Criado usuário: ${userData.name}`)
      } else {
        console.log(`ℹ️  Usuário ${userData.name} já existe`)
      }
    }

    console.log('✅ Pontuações atualizadas com sucesso!')
    console.log('Agora o pódio terá usuários para exibir!')

  } catch (error) {
    console.error('❌ Erro ao atualizar pontuações:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addPointsToTestUser()