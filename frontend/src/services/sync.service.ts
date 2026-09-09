import { request } from './api';

export function runSync(jurisdiction: string): Promise<void> {
  return request<void>(`/sync?jurisdiction=${encodeURIComponent(jurisdiction)}`, {
    method: 'POST',
  });
}
