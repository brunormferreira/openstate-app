import type { PeopleFiltersResponse, PeopleListResponse, PeopleQuery } from '@/models/people';
import { request } from './api';

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
  return request<PeopleListResponse>(`/people${qs ? `?${qs}` : ''}`, { signal });
}

export function fetchPeopleFilters(signal?: AbortSignal): Promise<PeopleFiltersResponse> {
  return request<PeopleFiltersResponse>('/people/filters', { signal });
}
