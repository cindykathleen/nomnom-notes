import { describe, it, expect } from 'vitest';
import { formatActivityTimestamp } from './formatActivityTimestamp';

describe('formatActivityTimestamp', () => {
  const now = new Date('2026-07-20T15:00:00.000Z');

  it('formats same-day minutes ago', () => {
    const date = new Date('2026-07-20T14:45:00.000Z');
    expect(formatActivityTimestamp(date, now)).toBe('15 minutes ago');
  });

  it('formats same-day one minute ago', () => {
    const date = new Date('2026-07-20T14:59:30.000Z');
    expect(formatActivityTimestamp(date, now)).toBe('1 minute ago');
  });

  it('formats same-day hours ago', () => {
    const date = new Date('2026-07-20T12:00:00.000Z');
    expect(formatActivityTimestamp(date, now)).toBe('3 hours ago');
  });

  it('formats days ago when not today but within 7 days', () => {
    const date = new Date('2026-07-17T15:00:00.000Z');
    expect(formatActivityTimestamp(date, now)).toBe('3 days ago');
  });

  it('formats 1 day ago', () => {
    const date = new Date('2026-07-19T15:00:00.000Z');
    expect(formatActivityTimestamp(date, now)).toBe('1 day ago');
  });

  it('formats weeks ago when older than 7 days and younger than 1 year', () => {
    const eightDaysAgo = new Date('2026-07-12T15:00:00.000Z');
    expect(formatActivityTimestamp(eightDaysAgo, now)).toBe('1 week ago');

    const fiftyWeeksAgo = new Date(now.getTime() - 50 * 7 * 24 * 60 * 60 * 1000);
    expect(formatActivityTimestamp(fiftyWeeksAgo, now)).toBe('50 weeks ago');
  });

  it('formats absolute date when 1 year or older', () => {
    const oneYearAgo = new Date('2025-07-20T15:00:00.000Z');
    expect(formatActivityTimestamp(oneYearAgo, now)).toBe('Jul 20, 2025');

    const older = new Date('2024-01-05T12:00:00.000Z');
    expect(formatActivityTimestamp(older, now)).toBe('Jan 5, 2024');
  });
});
