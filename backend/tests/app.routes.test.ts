import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { AppError } from '../src/shared/errors/AppError.js';
import type { PeopleService } from '../src/modules/people/people.service.js';
import type { SyncService } from '../src/modules/sync/sync.service.js';

function makeApp(overrides: { people?: Partial<PeopleService>; sync?: Partial<SyncService> } = {}) {
  const peopleService: PeopleService = {
    list: vi.fn(async (query) => ({
      items: [],
      total: 0,
      page: query.page ?? 1,
      perPage: query.perPage ?? 20,
      totalPages: 0,
    })),
    listFilters: vi.fn(async () => ({ states: ['GA'], parties: ['Democratic'] })),
    ...overrides.people,
  };

  const syncService: SyncService = {
    run: vi.fn(async (jurisdiction) => ({ jurisdiction, peopleUpserted: 0 })),
    ...overrides.sync,
  };

  const app = createApp({ peopleService, syncService, corsOrigin: '*' });
  return { app, peopleService, syncService };
}

describe('GET /health', () => {
  it('reports the service as healthy', async () => {
    const { app } = makeApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/people', () => {
  it('forwards state and party filters to the service', async () => {
    const { app, peopleService } = makeApp();

    await request(app).get('/api/people?state=GA&party=Democratic');

    expect(peopleService.list).toHaveBeenCalledWith(
      expect.objectContaining({ state: 'GA', party: 'Democratic' }),
    );
  });

  it('applies default pagination when no params are given', async () => {
    const { app, peopleService } = makeApp();

    const response = await request(app).get('/api/people');

    expect(response.status).toBe(200);
    expect(peopleService.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, perPage: 20 }),
    );
  });

  it('caps perPage at the maximum allowed value', async () => {
    const { app, peopleService } = makeApp();

    await request(app).get('/api/people?perPage=999');

    expect(peopleService.list).toHaveBeenCalledWith(expect.objectContaining({ perPage: 100 }));
  });

  it('clamps non-positive pages to the first page', async () => {
    const { app, peopleService } = makeApp();

    await request(app).get('/api/people?page=0');

    expect(peopleService.list).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
  });

  it('falls back to defaults when pagination params are not numeric', async () => {
    const { app, peopleService } = makeApp();

    await request(app).get('/api/people?page=abc&perPage=xyz');

    expect(peopleService.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, perPage: 20 }),
    );
  });

  it('normalizes blank filters to undefined', async () => {
    const { app, peopleService } = makeApp();

    await request(app).get('/api/people?state=&party=');

    expect(peopleService.list).toHaveBeenCalledWith(
      expect.objectContaining({ state: undefined, party: undefined }),
    );
  });

  it('propagates AppError status and code through the error handler', async () => {
    const { app } = makeApp({
      people: {
        list: vi.fn(async () => {
          throw new AppError('OpenStates API token is invalid', 502, 'UPSTREAM_UNAUTHORIZED');
        }),
      },
    });

    const response = await request(app).get('/api/people');

    expect(response.status).toBe(502);
    expect(response.body.error).toEqual({
      code: 'UPSTREAM_UNAUTHORIZED',
      message: 'OpenStates API token is invalid',
    });
  });
});

describe('GET /api/people/filters', () => {
  it('returns the distinct filter values', async () => {
    const { app } = makeApp();

    const response = await request(app).get('/api/people/filters');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ states: ['GA'], parties: ['Democratic'] });
  });
});

describe('POST /api/sync', () => {
  it('rejects a request without a jurisdiction', async () => {
    const { app, syncService } = makeApp();

    const response = await request(app).post('/api/sync');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('BAD_REQUEST');
    expect(syncService.run).not.toHaveBeenCalled();
  });

  it('runs the sync synchronously and returns the persisted counts', async () => {
    const { app, syncService } = makeApp();

    const response = await request(app).post('/api/sync?jurisdiction=Georgia');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      jurisdiction: 'ocd-jurisdiction/country:us/state:ga/government',
      peopleUpserted: 0,
    });
    expect(typeof response.body.durationMs).toBe('number');
    expect(syncService.run).toHaveBeenCalledWith(
      'ocd-jurisdiction/country:us/state:ga/government',
    );
    expect(syncService.run).toHaveBeenCalledTimes(1);
  });

  it('propagates upstream failures while the sync runs', async () => {
    const { app } = makeApp({
      sync: { run: vi.fn(async () => Promise.reject(new Error('upstream down'))) },
    });

    const response = await request(app).post('/api/sync?jurisdiction=Georgia');

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('unknown routes', () => {
  it('returns a 404 envelope', async () => {
    const { app } = makeApp();

    const response = await request(app).get('/api/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual({ code: 'NOT_FOUND', message: 'Route not found' });
  });
});
