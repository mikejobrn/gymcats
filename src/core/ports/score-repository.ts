export interface ScoreRepository {
  // find the daily score row for a user/date (date in ISO yyyy-mm-dd)
  findByUserAndDate(userId: string, dateISO: string): Promise<any | null>

  // upsert the daily score row and merge completion flags
  upsert(userId: string, dateISO: string, score: number, activityType?: string): Promise<any>
  
  // list daily scores within a date range (startISO, endISO in yyyy-mm-dd)
  listByUserAndRange(userId: string, startISO: string, endISO: string): Promise<any[]>
}
