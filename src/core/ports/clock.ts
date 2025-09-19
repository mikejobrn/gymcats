export interface Clock {
  now(): Date
  startOfDay(d?: Date): Date
  isoDate(d?: Date): string
}
