import type { PeopleFiltersResponse, PeopleListResponse, PeopleQuery, SyncResult } from './types';
import { request } from './client';

export function fetchPeople(
  params: PeopleQuery,
  signal?: AbortSignal,
): Promise<PeopleListResponse> {
  const query = new URLSearchParams();
  if (params.state) query.set('state', params.state);
  if (params.party) query.set('party', params.party);
  if (params.page) query.set('page', String(params.page));
  if (params.perPage) query.set('perPage', String(params.perPage));

  const qs = query.toString();
  const url = qs ? `/people?${qs}` : '/people';
  return request<PeopleListResponse>(url, { signal });
}

export function fetchPeopleFilters(signal?: AbortSignal): Promise<PeopleFiltersResponse> {
  return request<PeopleFiltersResponse>('/people/filters', { signal });
}

/** A sync can paginate several upstream pages, so allow up to a minute before timing out. */
export function runSync(jurisdiction: string): Promise<SyncResult> {
  return request<SyncResult>(`/sync?jurisdiction=${encodeURIComponent(jurisdiction)}`, {
    method: 'POST',
    timeoutMs: 60_000,
  });
}
