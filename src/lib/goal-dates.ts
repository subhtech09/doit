import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayLocalDate(now?: Date): Date {
  return startOfDay(now ?? new Date());
}

export function toCanonicalDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseCanonicalDate(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const parsed = parseISO(value);
  if (!isValid(parsed)) {
    return null;
  }

  if (toCanonicalDateString(parsed) !== value) {
    return null;
  }

  return startOfDay(parsed);
}

export function isCanonicalDate(value: string): boolean {
  return parseCanonicalDate(value) !== null;
}

export function validateCreationEndDate(value: string, now?: Date): string | null {
  const parsed = parseCanonicalDate(value);
  if (!parsed) {
    return "Enter a valid date in YYYY-MM-DD format.";
  }

  const today = getTodayLocalDate(now);
  if (differenceInCalendarDays(parsed, today) < 0) {
    return "End date must be today or a future date.";
  }

  return null;
}

export function getDaysLeft(endDate: string, today: Date): number {
  const parsed = parseCanonicalDate(endDate);
  if (!parsed) {
    return Number.NaN;
  }

  return differenceInCalendarDays(parsed, startOfDay(today));
}

export function formatDisplayDate(endDate: string): string {
  const parsed = parseCanonicalDate(endDate);
  if (!parsed) {
    return endDate;
  }

  return format(parsed, "MMM d, yyyy");
}

export function getDeadlineText(endDate: string, today: Date): string {
  const daysLeft = getDaysLeft(endDate, today);
  if (Number.isNaN(daysLeft)) {
    return "Invalid date";
  }

  if (daysLeft < 0) {
    const overdueBy = Math.abs(daysLeft);
    return overdueBy === 1 ? "Overdue by 1 day" : `Overdue by ${overdueBy} days`;
  }

  if (daysLeft === 0) {
    return "Due today";
  }

  return daysLeft === 1 ? "1 day left" : `${daysLeft} days left`;
}
