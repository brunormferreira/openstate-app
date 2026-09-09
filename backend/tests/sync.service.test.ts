import { describe, expect, it, vi } from 'vitest';
import type { OpenStatesClient } from '../src/infra/openstates/openStatesClient.js';
import type { SyncRepository } from '../src/modules/sync/sync.repository.js';
import { DefaultSyncService } from '../src/modules/sync/sync.service.js';

function makePerson(id: string) {
  const jurisdiction = 'ocd-jurisdiction/country:us/state:nc/government';
  return {
    id,
    name: `Person ${id}`,
    given_name: 'X',
    family_name: 'Y',
    jurisdiction: { id: jurisdiction, name: 'North Carolina', classification: 'state' },
  };
}

function clientStub(pages: Array<Array<{ id: string }>>): OpenStatesClient {
  return {
    listPeopleByJurisdiction: vi.fn(async (_jurisdiction: string, page: number) => {
      const results = pages[page - 1] ?? [];
      return {
        results: results.map((p) => makePerson(p.id)),
        pagination: {
          per_page: 50,
          page,
          max_page: pages.length,
          total_items: pages.flat().length,
        },
      };
    }),
  };
}

function repoStub(): SyncRepository & { upserts: number; calls: number } {
  const calls = { upserts: 0, calls: 0 };
  return {
    get upserts() {
      return calls.upserts;
    },
    get calls() {
      return calls.calls;
    },
    upsertMany: vi.fn(async (people) => {
      calls.upserts += people.length;
      calls.calls += 1;
      return people.length;
    }),
  };
}

describe('DefaultSyncService', () => {
  it('upserts all people across multiple pages of a single jurisdiction', async () => {
    const client = clientStub([[{ id: 'p1' }, { id: 'p2' }], [{ id: 'p3' }]]);
    const repo = repoStub();
    const service = new DefaultSyncService(client, repo);

    const result = await service.run('Georgia');

    expect(result).toEqual({ jurisdiction: 'Georgia', peopleUpserted: 3 });
    expect(repo.calls).toBe(2);
  });

  it('does nothing when a jurisdiction has no results', async () => {
    const client = clientStub([]);
    const repo = repoStub();
    const service = new DefaultSyncService(client, repo);

    const result = await service.run('EmptyState');

    expect(result.peopleUpserted).toBe(0);
    expect(repo.calls).toBe(0);
  });
});
