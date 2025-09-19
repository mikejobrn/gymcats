export interface DailyScore {
  id: string;
  userId: string;
  date: string;
  score: number;
  waterCompleted: boolean;
  resistanceCompleted: boolean;
  cardioCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreRepository {
  // find the daily score row for a user/date (date in ISO yyyy-mm-dd)
  findByUserAndDate(userId: string, dateISO: string): Promise<DailyScore | null>

  // upsert the daily score row and merge completion flags
  upsert(userId: string, dateISO: string, score: number, activityType?: string): Promise<DailyScore>
  
  // list daily scores within a date range (startISO, endISO in yyyy-mm-dd)
  listByUserAndRange(userId: string, startISO: string, endISO: string): Promise<DailyScore[]>
}
