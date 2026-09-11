import { describe, it, expect, beforeEach } from 'vitest';
import { getLastSync, recordSync, formatRelativeTime } from './syncHistory';

describe('syncHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLastSync', () => {
    it('returns null for unknown jurisdiction', () => {
      expect(getLastSync('unknown')).toBeNull();
    });

    it('returns stored sync record', () => {
      recordSync('GA', 10);
      const result = getLastSync('GA');
      expect(result).not.toBeNull();
      expect(result!.peopleCount).toBe(10);
      expect(typeof result!.syncedAt).toBe('number');
    });
  });

  describe('recordSync', () => {
    it('stores sync record in localStorage', () => {
      recordSync('GA', 10);
      const raw = localStorage.getItem('openstates:sync-history');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.GA.peopleCount).toBe(10);
    });

    it('overwrites previous record for same jurisdiction', () => {
      recordSync('GA', 10);
      recordSync('GA', 20);
      const result = getLastSync('GA');
      expect(result!.peopleCount).toBe(20);
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for less than 1 minute', () => {
      expect(formatRelativeTime(Date.now() - 30_000)).toBe('just now');
    });

    it('returns minutes ago', () => {
      expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe('5 minutes ago');
    });

    it('returns singular "minute ago"', () => {
      expect(formatRelativeTime(Date.now() - 1 * 60_000)).toBe('1 minute ago');
    });

    it('returns hours ago', () => {
      expect(formatRelativeTime(Date.now() - 2 * 3600_000)).toBe('2 hours ago');
    });

    it('returns singular "hour ago"', () => {
      expect(formatRelativeTime(Date.now() - 1 * 3600_000)).toBe('1 hour ago');
    });

    it('returns days ago', () => {
      expect(formatRelativeTime(Date.now() - 3 * 86400_000)).toBe('3 days ago');
    });

    it('returns singular "day ago"', () => {
      expect(formatRelativeTime(Date.now() - 1 * 86400_000)).toBe('1 day ago');
    });
  });
});
