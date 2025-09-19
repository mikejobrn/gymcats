import type { ActivityRepository } from '../../ports/activity-repository'
import type { Activity } from '../../entities/activity'
import { prisma } from '../../../lib/prisma'
import type { ActivityType as PrismaActivityType } from '@prisma/client'

function prismaToEntityType(t: PrismaActivityType): Activity['type'] {
  return t.toLowerCase() as Activity['type']
}

function entityToPrismaType(t: Activity['type']): PrismaActivityType {
  return t.toUpperCase() as PrismaActivityType
}

export class PrismaActivityRepository implements ActivityRepository {
  async findByUserIdAndDate(userId: string, dateISO: string): Promise<Activity | null> {
    const dt = new Date(dateISO + 'T00:00:00Z')
    const row = await prisma.activityLog.findFirst({ where: { userId, date: dt } })
    if (!row) return null
    return { id: row.id, userId: row.userId, type: prismaToEntityType(row.type), date: row.date.toISOString().slice(0,10) }
  }
  async add(activity: Activity): Promise<void> {
    await prisma.activityLog.create({ data: {
      id: activity.id,
      userId: activity.userId,
      type: entityToPrismaType(activity.type),
      completed: true,
      date: new Date(activity.date + 'T00:00:00Z'),
      points: 0
    }})
  }
  async listByUserAndRange(userId: string, startISO: string, endISO: string): Promise<Activity[]> {
    const start = new Date(startISO + 'T00:00:00Z')
    const end = new Date(endISO + 'T23:59:59Z')
    const rows = await prisma.activityLog.findMany({ where: { userId, date: { gte: start, lte: end } } })
    return rows.map(r => ({ id: r.id, userId: r.userId, type: prismaToEntityType(r.type), date: r.date.toISOString().slice(0,10) }))
  }
}
