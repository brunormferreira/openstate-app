import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { fetchPeople, fetchPeopleFilters } from '@/api/people.api';
import type { PeopleFiltersResponse, PeopleListResponse } from '@/api/types';
import { usePeople, usePeopleFilters } from './usePeople';

vi.mock('@/api/people.api', () => ({
  fetchPeople: vi.fn(),
  fetchPeopleFilters: vi.fn(),
}));

const mockFetchPeople = vi.mocked(fetchPeople);
const mockFetchPeopleFilters = vi.mocked(fetchPeopleFilters);

const peopleResponse: PeopleListResponse = {
  items: [],
  total: 0,
  page: 1,
  perPage: 20,
  totalPages: 0,
};

const filtersResponse: PeopleFiltersResponse = {
  states: ['GA', 'NC'],
  parties: ['Dem', 'Rep'],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('usePeople', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads people matching the given query', async () => {
    mockFetchPeople.mockResolvedValue(peopleResponse);
    const query = { state: 'GA', party: 'Dem', page: 2, perPage: 10 };
    const { result } = renderHook(() => usePeople(query), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data).toEqual(peopleResponse));
    expect(mockFetchPeople).toHaveBeenCalledWith(query, expect.any(AbortSignal));
    expect(result.current.isLoading).toBe(false);
  });

  it('exposes the error when the request fails', async () => {
    mockFetchPeople.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => usePeople({}), { wrapper });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});

describe('usePeopleFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the filter options', async () => {
    mockFetchPeopleFilters.mockResolvedValue(filtersResponse);
    const { result } = renderHook(() => usePeopleFilters(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(filtersResponse));
    expect(mockFetchPeopleFilters).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it('exposes the error when the request fails', async () => {
    mockFetchPeopleFilters.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => usePeopleFilters(), { wrapper });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});