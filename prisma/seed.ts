import { PrismaClient, ActivityType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { startOfDay } from 'date-fns'

// Helper to get UTC midnight for a Date
function utcStartOfDay(d: Date) {
  const dt = startOfDay(d)
  // force timezone to UTC midnight by constructing an ISO date at 00:00:00Z
  const iso = dt.toISOString().slice(0, 10) + 'T00:00:00Z'
  return new Date(iso)
}

const prisma = new PrismaClient()

async function main() {
  // Idempotent seed: if user exists, update; otherwise create.
  const email = 'test+seed@gymcats.local'

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Seed User',
        // if your schema uses hashedPassword field
        hashedPassword: bcrypt.hashSync('password', 10),
        createdAt: new Date(),
      },
    })
    console.log('Created user', user.email)
  } else {
    console.log('User already exists', user.email)
  }

  // Create example activities for today and yesterday (normalized to UTC startOfDay)
  const today = utcStartOfDay(new Date())
  const yesterday = utcStartOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000))

  const activities = [
    { userId: user.id, type: ActivityType.WATER, date: today },
    { userId: user.id, type: ActivityType.RESISTANCE, date: today },
    { userId: user.id, type: ActivityType.CARDIO, date: yesterday },
  ]

  for (const a of activities) {
    // Attempt to find an existing activity on the same day and type
    const existing = await prisma.activityLog.findFirst({
      where: {
        userId: a.userId,
        type: a.type,
        // naive same-day match: compare date parts
        date: a.date,
      },
    })

    if (!existing) {
      await prisma.activityLog.create({ data: {
        userId: a.userId,
        type: a.type,
        date: a.date,
        completed: true,
      } })
      console.log('Created activity', a.type, a.date.toISOString())
    } else {
      console.log('Activity already exists', a.type)
    }
  }

  // Also create a standard test user and example podium users (migrated from scripts)
  const testEmail = 'teste@gymcats.app'
  const existingTest = await prisma.user.findUnique({ where: { email: testEmail } })
  if (!existingTest) {
    await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Gatinha Teste',
        hashedPassword: bcrypt.hashSync('teste123', 12),
        totalScore: 0,
        streakDays: 0,
      }
    })
    console.log('Created test user', testEmail)
  } else {
    console.log('Test user already exists', testEmail)
  }

  // Example podium users
  const exampleUsers = [
    { name: 'Gatinha Campeã', email: 'campea@gymcats.app', totalScore: 300, streakDays: 15 },
    { name: 'Gatinha Forte', email: 'forte@gymcats.app', totalScore: 200, streakDays: 10 },
    { name: 'Gatinha Dedicada', email: 'dedicada@gymcats.app', totalScore: 100, streakDays: 5 },
    { name: 'Gatinha Iniciante', email: 'iniciante@gymcats.app', totalScore: 50, streakDays: 3 },
  ]

  for (const u of exampleUsers) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } })
    if (!exists) {
      await prisma.user.create({ data: { ...u, hashedPassword: '$2a$12$dummyhash' } })
      console.log('Created example user', u.email)
    } else {
      console.log('Example user exists', u.email)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
