import { addActivity } from '../src/lib/scoring-new'
import { prisma } from '../src/lib/prisma'

async function run() {
  try {
    // Find a test user (first user)
    const user = await prisma.user.findFirst()
    if (!user) {
      console.error('No users in DB')
      process.exit(1)
    }
    console.log('Using user:', user.id, user.email)

    const activity = await addActivity(user.id, 'WATER')
    console.log('Activity result:', activity)

    const { formatDateForDB, getBrazilDate } = await import('../src/lib/date-utils')
    const dateForScore = formatDateForDB(getBrazilDate())
    const daily = await prisma.dailyScore.findUnique({ where: { userId_date: { userId: user.id, date: dateForScore } } })
    console.log('DailyScore:', daily)
  } catch (err) {
    console.error('Error in test runner:', err)
  } finally {
    await prisma.$disconnect()
  }
}

run()
