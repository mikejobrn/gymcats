export type UserCreateInput = {
  email: string
  name?: string
  hashedPassword?: string
  totalScore?: number
  streakDays?: number
  [key: string]: unknown
}
