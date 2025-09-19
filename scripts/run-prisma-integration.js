const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const TMP_DB = path.join(process.cwd(), 'tmp', 'test.db')
const prismaDir = path.join(process.cwd(), 'prisma')
const mainSchema = path.join(prismaDir, 'schema.prisma')
const testSchema = path.join(prismaDir, 'test-schema.prisma')
const backupSchema = path.join(prismaDir, 'schema.prisma.bak')

function ensureTmpDir() {
  const dir = path.dirname(TMP_DB)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function run() {
  try {
    ensureTmpDir()
    process.env.DATABASE_URL = `file:${TMP_DB}`

    // backup and swap schema
    if (fs.existsSync(mainSchema)) fs.copyFileSync(mainSchema, backupSchema)
    fs.copyFileSync(testSchema, mainSchema)

    console.log('Pushing test schema...')
    execSync(`npx prisma db push --schema=${mainSchema}`, { stdio: 'inherit' })
    console.log('Generating client...')
    execSync(`npx prisma generate --schema=${mainSchema}`, { stdio: 'inherit' })

    const { PrismaClient } = require(path.join(process.cwd(), 'node_modules', '@prisma', 'client'))
    const prisma = new PrismaClient()
    await prisma.$connect()

    // create a user
    const user = await prisma.user.create({ data: { email: 'inttest@ex.com', name: 'Integration Test' } })

    const today = new Date()
    const day1 = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    const day2 = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)

    await prisma.activityLog.create({ data: { userId: user.id, type: 'WATER', date: day1 } })
    await prisma.activityLog.create({ data: { userId: user.id, type: 'WATER', date: day2 } })

    // Simulate AddActivityUseCase behavior: create activity, recalc score, upsert dailyScore, apply bonus in transaction
    const dateISO = today.toISOString().slice(0,10)
    const dt = new Date(dateISO + 'T00:00:00Z')

    // compute score simple: water=2
    const score = 2

    const result = await prisma.$transaction(async (tx) => {
      // upsert dailyScore merging flags
      const existing = await tx.dailyScore.findUnique({ where: { userId_date: { userId: user.id, date: dt } } })
      const newWater = true
      const ds = await tx.dailyScore.upsert({
        where: { userId_date: { userId: user.id, date: dt } },
        create: { userId: user.id, date: dt, score, waterCompleted: newWater, resistanceCompleted: false, cardioCompleted: false },
        update: { score, waterCompleted: newWater }
      })

      // determine bonus (simple: since we have entries for last 2 days plus today => 3-day streak)
      const bonusPoints = 3
      const bonus = await tx.bonus.create({ data: { userId: user.id, points: bonusPoints, reason: 'Streak test', type: 'STREAK_3_DAYS', date: dt } })
      const updatedUser = await tx.user.update({ where: { id: user.id }, data: { totalScore: { increment: bonusPoints } } })

      return { ds, bonus, updatedUser }
    })

    console.log('Transaction result:', result)

    // cleanup
    await prisma.$disconnect()

    // restore schema
    if (fs.existsSync(backupSchema)) {
      fs.copyFileSync(backupSchema, mainSchema)
      fs.unlinkSync(backupSchema)
      execSync(`npx prisma generate --schema=${mainSchema}`, { stdio: 'inherit' })
    }

    process.exit(0)
  } catch (err) {
    console.error('Integration runner error:', err)
    try { if (fs.existsSync(backupSchema)) { fs.copyFileSync(backupSchema, mainSchema); fs.unlinkSync(backupSchema); execSync(`npx prisma generate --schema=${mainSchema}`, { stdio: 'inherit' }) } } catch(e){}
    process.exit(2)
  }
}

run()
