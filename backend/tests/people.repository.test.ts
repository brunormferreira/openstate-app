import { describe, expect, it, vi, beforeEach } from 'vitest';

const { mockTransaction, mockFindMany, mockCount } = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('../src/infra/database/prisma.js', () => ({
  prisma: {
    $transaction: mockTransaction,
    person: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { peopleRepository } from '../src/modules/people/people.repository.js';

describe('peopleRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const items = [{ id: '1', name: 'Alice' }];
      mockTransaction.mockResolvedValueOnce([items, 1]);

      const result = await peopleRepository.list({ page: 1, perPage: 10 });

      expect(result).toEqual({
        items,
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
    });

    it('applies state and party filters', async () => {
      mockTransaction.mockResolvedValueOnce([[], 0]);

      await peopleRepository.list({ state: 'GA', party: 'Democratic' });

      expect(mockTransaction).toHaveBeenCalled();
    });

    it('uses default pagination', async () => {
      mockTransaction.mockResolvedValueOnce([[], 0]);

      await peopleRepository.list({});

      expect(mockTransaction).toHaveBeenCalled();
    });
  });

  describe('listFilters', () => {
    it('returns distinct states and parties', async () => {
      const states = [{ state: 'GA' }, { state: 'NC' }];
      const parties = [{ party: 'Dem' }, { party: 'Rep' }];
      mockTransaction.mockResolvedValueOnce([states, parties]);

      const result = await peopleRepository.listFilters();

      expect(result).toEqual({
        states: ['GA', 'NC'],
        parties: ['Dem', 'Rep'],
      });
    });

    it('filters out null values and sorts', async () => {
      const states = [{ state: 'NC' }, { state: null }, { state: 'AL' }];
      const parties = [{ party: null }];
      mockTransaction.mockResolvedValueOnce([states, parties]);

      const result = await peopleRepository.listFilters();

      expect(result.states).toEqual(['AL', 'NC']);
      expect(result.parties).toEqual([]);
    });
  });
});
