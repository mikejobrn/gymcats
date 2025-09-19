import { startOfDay, formatISO } from 'date-fns'
import type { Clock } from '../../ports/clock'

export class SystemClock implements Clock {
  now(): Date {
    return new Date()
  }
  startOfDay(d?: Date): Date {
    return startOfDay(d ?? this.now())
  }
  isoDate(d?: Date): string {
    return formatISO(this.startOfDay(d), { representation: 'date' })
  }
}
