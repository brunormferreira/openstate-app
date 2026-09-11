import { describe, expect, it, vi } from 'vitest';
import { PeopleController } from '../src/modules/people/people.controller.js';
import type { PeopleService } from '../src/modules/people/people.service.js';
import type { Request, Response } from 'express';

function makeController(overrides: Partial<PeopleService> = {}) {
  const service: PeopleService = {
    list: vi.fn(async () => ({
      items: [],
      total: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
    })),
    listFilters: vi.fn(async () => ({ states: [], parties: [] })),
    ...overrides,
  };
  return { controller: new PeopleController(service), service };
}

function req(query: Record<string, string> = {}): Request {
  return { query } as unknown as Request;
}

function res(): Response {
  const json = vi.fn();
  return { json, status: vi.fn().mockReturnThis() } as unknown as Response;
}

describe('PeopleController', () => {
  describe('list', () => {
    it('returns people list', async () => {
      const { controller, service } = makeController();
      const response = res();

      await controller.list(req({}), response);

      expect(response.json).toHaveBeenCalled();
      expect(service.list).toHaveBeenCalled();
    });

    it('handles state and party filters', async () => {
      const { controller, service } = makeController();
      const response = res();

      await controller.list(req({ state: 'GA', party: 'Democratic' }), response);

      expect(service.list).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'GA', party: 'Democratic' }),
      );
    });
  });

  describe('listFilters', () => {
    it('returns filter values', async () => {
      const { controller } = makeController({ listFilters: vi.fn(async () => ({ states: ['GA'], parties: ['Dem'] })) });
      const response = res();

      await controller.listFilters(req(), response);

      expect(response.json).toHaveBeenCalledWith({ states: ['GA'], parties: ['Dem'] });
    });
  });
});
