import { describe, expect, it, vi } from 'vitest';
import type { PeopleRepository } from '../src/modules/people/people.repository.js';
import { DefaultPeopleService } from '../src/modules/people/people.service.js';

function repoStub(): PeopleRepository {
  return {
    list: vi.fn(async (params) => ({
      items: [{ id: 'p1', name: 'A' } as never],
      total: 1,
      page: params.page ?? 1,
      perPage: params.perPage ?? 20,
      totalPages: 1,
    })),
    listFilters: vi.fn(async () => ({ states: ['GA', 'NC'], parties: ['Democratic'] })),
  };
}

describe('DefaultPeopleService', () => {
  it('forwards filters and pagination to the repository', async () => {
    const repo = repoStub();
    const service = new DefaultPeopleService(repo);

    await service.list({ state: 'NC', party: 'Democratic', page: 2, perPage: 10 });

    expect(repo.list).toHaveBeenCalledWith({
      state: 'NC',
      party: 'Democratic',
      page: 2,
      perPage: 10,
    });
  });

  it('normalizes empty filters to undefined', async () => {
    const repo = repoStub();
    const service = new DefaultPeopleService(repo);

    await service.list({ state: '' });

    expect(repo.list).toHaveBeenCalledWith({
      state: undefined,
      party: undefined,
      page: undefined,
      perPage: undefined,
    });
  });

  it('exposes distinct filter values', async () => {
    const repo = repoStub();
    const service = new DefaultPeopleService(repo);

    const filters = await service.listFilters();

    expect(filters).toEqual({ states: ['GA', 'NC'], parties: ['Democratic'] });
  });

  it('returns pagination metadata from the repository', async () => {
    const repo = repoStub();
    const service = new DefaultPeopleService(repo);

    const result = await service.list({ page: 1, perPage: 20 });

    expect(result).toMatchObject({
      total: 1,
      page: 1,
      perPage: 20,
      totalPages: 1,
    });
  });
});
