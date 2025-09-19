import type { UserCreateInput } from '@/core/types/user'

export interface UserRepository {
  findByEmail(email: string): Promise<any | null>
  findById(id: string): Promise<any | null>
  update(id: string, data: Record<string, any>): Promise<any>
  create(data: UserCreateInput): Promise<any>
  // return ranking array with fields: id,name,email,totalScore,streakDays,createdAt
  getRanking?(limit?: number): Promise<Array<Record<string, any>>>
}
