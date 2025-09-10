// Utilities for handling dates in Brazil timezone (UTC-3)
const BRAZIL_TIMEZONE_OFFSET = -3 * 60; // -3 hours in minutes

export function getBrazilDate(date?: Date): Date {
  const now = date || new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brazilTime = new Date(utc + (BRAZIL_TIMEZONE_OFFSET * 60000));
  return brazilTime;
}

export function getStartOfDay(date: Date): Date {
  const brazilDate = getBrazilDate(date);
  const startOfDay = new Date(brazilDate);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getEndOfDay(date: Date): Date {
  const brazilDate = getBrazilDate(date);
  const endOfDay = new Date(brazilDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

export function getDateOnly(date: Date): Date {
  const brazilDate = getBrazilDate(date);
  return new Date(brazilDate.getFullYear(), brazilDate.getMonth(), brazilDate.getDate());
}

export function formatDateForDB(date: Date): Date {
  // Return date in Brazil timezone but stored as UTC for consistency
  const brazilDate = getBrazilDate(date);
  return new Date(brazilDate.getFullYear(), brazilDate.getMonth(), brazilDate.getDate());
}
