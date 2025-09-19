import { prisma } from '../../../lib/prisma'
import type { UserRepository } from '../../ports/user-repository'
import type { UserCreateInput } from '@/core/types/user'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }
  async update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data })
  }

  async create(data: UserCreateInput) {
    return prisma.user.create({ data: data as UserCreateInput })
  }

  // convenience: fetch user with related dailyScores and activityLogs
  async findByEmailWithRelations(email: string) {
    return prisma.user.findUnique({ where: { email }, include: {
      dailyScores: { orderBy: { date: 'desc' }, take: 7 },
      activityLogs: { where: {}, orderBy: { date: 'desc' } }
    }})
  }

  async getRanking(limit = 50) {
    const users = await prisma.user.findMany({
      where: { totalScore: { gt: 0 } },
      select: { id: true, name: true, email: true, totalScore: true, streakDays: true, createdAt: true },
      orderBy: [ { totalScore: 'desc' }, { streakDays: 'desc' }, { createdAt: 'asc' } ],
      take: limit
    })
    return users.map((u, i) => ({ ...u, rank: i + 1, email: u.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') }))
  }
}
