import type { Clock } from '../../ports/clock'

export class FixedClock implements Clock {
  private _now: Date
  constructor(isoOrDate: string | Date) {
    this._now = typeof isoOrDate === 'string' ? new Date(isoOrDate) : new Date(isoOrDate)
  }
  now(): Date {
    return new Date(this._now)
  }
  startOfDay(d?: Date): Date {
    const dt = d ?? this._now
    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()))
  }
  isoDate(d?: Date): string {
    return this.startOfDay(d).toISOString().slice(0, 10)
  }
  advanceDays(n: number) {
    this._now = new Date(this._now.getTime() + n * 24 * 60 * 60 * 1000)
  }
}
