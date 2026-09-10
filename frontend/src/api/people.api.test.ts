import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPeople, fetchPeopleFilters } from './people.api';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ items: [], total: 0, page: 1, perPage: 20, totalPages: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchPeople', () => {
  it('calls /people with no params when empty', async () => {
    await fetchPeople({});
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/people'),
      expect.anything(),
    );
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe('/api/people');
  });

  it('appends state, party, page, perPage when provided', async () => {
    await fetchPeople({ state: 'GA', party: 'Republican', page: 3, perPage: 10 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('state=GA');
    expect(url).toContain('party=Republican');
    expect(url).toContain('page=3');
    expect(url).toContain('perPage=10');
  });

  it('omits empty/undefined params', async () => {
    await fetchPeople({ state: '', party: undefined, page: 1 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe('/api/people?page=1');
  });

  it('omits page when not provided', async () => {
    await fetchPeople({ state: 'NY' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe('/api/people?state=NY');
  });
});

describe('fetchPeopleFilters', () => {
  it('calls /people/filters', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ states: [], parties: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await fetchPeopleFilters();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/people/filters'),
      expect.anything(),
    );
  });
});
