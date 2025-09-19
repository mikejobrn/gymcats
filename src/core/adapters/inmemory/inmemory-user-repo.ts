type User = {
  id: string;
  name?: string;
  email: string;
  hashedPassword?: string;
  totalScore: number;
  streakDays: number;
  createdAt: string | Date;
  [key: string]: unknown;
}

export class InMemoryUserRepository {
  private users: Array<User> = []
  constructor(initial: Array<User> = []) { this.users = initial }
  async findByEmail(email: string) { return this.users.find(u => u.email === email) ?? null }
  async findById(id: string) { return this.users.find(u => u.id === id) ?? null }
  async update(id: string, data: Record<string, unknown>) { const u = this.users.find(x=>x.id===id); if (u) Object.assign(u, data); return u }
  async create(data: Record<string, unknown>) { const user = data as User; this.users.push(user); return user }
  async getRanking(limit = 50) {
    const users = this.users.filter(u => u.totalScore > 0).sort((a,b)=> b.totalScore - a.totalScore || b.streakDays - a.streakDays || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, limit)
    return users.map((u,i)=> ({ ...u, rank: i+1, email: u.email.replace(/(.{2})(.*)(@.*)/,'$1***$3') }))
  }
}
