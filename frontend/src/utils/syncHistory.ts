type SyncRecord = { syncedAt: number; peopleCount: number };
type SyncHistory = Record<string, SyncRecord>;

const STORAGE_KEY = 'openstates:sync-history';

function getSyncHistory(): SyncHistory {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as SyncHistory;
  } catch {
    return {};
  }
}

export function getLastSync(jurisdiction: string): SyncRecord | null {
  const history = getSyncHistory();
  return history[jurisdiction] ?? null;
}

export function recordSync(jurisdiction: string, peopleCount: number): void {
  const history = getSyncHistory();
  history[jurisdiction] = { syncedAt: Date.now(), peopleCount };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearSyncHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}