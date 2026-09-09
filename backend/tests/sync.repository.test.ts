import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PersonSegment } from '../src/models/sync.js';

const upsert = vi.fn((args: unknown) => args);
const transaction = vi.fn(async (operations: unknown[]) => operations);

vi.mock('../src/infra/database/prisma.js', () => ({
  prisma: {
    person: { upsert: (args: unknown) => upsert(args) },
    $transaction: (operations: unknown[]) => transaction(operations),
  },
}));

const { PrismaSyncRepository } = await import('../src/modules/sync/sync.repository.js');

function makePeople(count: number): PersonSegment[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index}`,
    name: `Person ${index}`,
    roleTitle: 'Senator',
    district: null,
    image: null,
    party: 'Democratic',
    state: 'GA',
    jurisdictionId: 'ocd-jurisdiction/country:us/state:ga/government',
  }));
}

beforeEach(() => {
  upsert.mockClear();
  transaction.mockClear();
});

describe('PrismaSyncRepository', () => {
  it('does not touch the database for an empty batch', async () => {
    const result = await new PrismaSyncRepository().upsertMany([]);

    expect(result).toBe(0);
    expect(transaction).not.toHaveBeenCalled();
  });

  it('runs a single transaction when the batch fits in one chunk', async () => {
    const result = await new PrismaSyncRepository().upsertMany(makePeople(10));

    expect(result).toBe(10);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(transaction.mock.calls[0][0]).toHaveLength(10);
  });

  it('splits larger batches into chunked transactions', async () => {
    const result = await new PrismaSyncRepository().upsertMany(makePeople(250));

    expect(result).toBe(250);
    expect(transaction).toHaveBeenCalledTimes(3);
    expect(transaction.mock.calls.map(([operations]) => operations.length)).toEqual([100, 100, 50]);
  });
});
