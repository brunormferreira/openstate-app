import { useQuery } from '@tanstack/react-query';
import { fetchPeople, fetchPeopleFilters } from '@/api/people.api';
import type { PeopleQuery } from '@/api/types';

const peopleKeys = {
  list: (query: PeopleQuery) =>
    [
      'people',
      {
        state: query.state ?? null,
        party: query.party ?? null,
        page: query.page ?? 1,
        perPage: query.perPage ?? null,
      },
    ] as const,
  filters: () => ['people', 'filters'] as const,
};

export function usePeople(query: PeopleQuery) {
  return useQuery({
    queryKey: peopleKeys.list(query),
    queryFn: ({ signal }) => fetchPeople(query, signal),
    staleTime: 30_000,
  });
}

export function usePeopleFilters() {
  return useQuery({
    queryKey: peopleKeys.filters(),
    queryFn: ({ signal }) => fetchPeopleFilters(signal),
    staleTime: 5 * 60_000,
  });
}
