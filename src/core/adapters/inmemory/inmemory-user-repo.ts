export class InMemoryUserRepository {
  private users: Array<any> = []
  constructor(initial: Array<any> = []) { this.users = initial }
  async findByEmail(email: string) { return this.users.find(u => u.email === email) ?? null }
  async findById(id: string) { return this.users.find(u => u.id === id) ?? null }
  async update(id: string, data: Record<string, any>) { const u = this.users.find(x=>x.id===id); Object.assign(u, data); return u }
  async getRanking(limit = 50) {
    const users = this.users.filter(u => u.totalScore > 0).sort((a,b)=> b.totalScore - a.totalScore || b.streakDays - a.streakDays || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, limit)
    return users.map((u,i)=> ({ ...u, rank: i+1, email: u.email.replace(/(.{2})(.*)(@.*)/,'$1***$3') }))
  }
}
