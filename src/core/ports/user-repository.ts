import type { UserCreateInput } from '@/core/types/user'

export interface User {
  id: string;
  name: string | null;
  email: string;
  hashedPassword: string | null;
  totalScore: number;
  streakDays: number;
  lastActivity: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  update(id: string, data: Record<string, unknown>): Promise<User>
  create(data: UserCreateInput): Promise<User>
  // return ranking array with fields: id,name,email,totalScore,streakDays,createdAt
  getRanking?(limit?: number): Promise<Array<Record<string, unknown>>>
}
