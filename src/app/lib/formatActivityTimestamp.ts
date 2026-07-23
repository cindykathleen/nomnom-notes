const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural} ago`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatActivityTimestamp(date: Date, now: Date = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - date.getTime());

  if (isSameCalendarDay(date, now)) {
    if (elapsed < HOUR_MS) {
      const minutes = Math.max(1, Math.floor(elapsed / MINUTE_MS));
      return pluralize(minutes, 'minute');
    }
    const hours = Math.max(1, Math.floor(elapsed / HOUR_MS));
    return pluralize(hours, 'hour');
  }

  if (elapsed < WEEK_MS) {
    const days = Math.max(1, Math.floor(elapsed / DAY_MS));
    return pluralize(days, 'day');
  }

  if (elapsed < YEAR_MS) {
    const weeks = Math.max(1, Math.floor(elapsed / WEEK_MS));
    return pluralize(weeks, 'week');
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
