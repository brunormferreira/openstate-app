import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

const ENV_KEYS = [
  'PORT',
  'OPENSTATES_API_URL',
  'OPENSTATES_API_TOKEN',
  'DATABASE_URL',
  'SYNC_CRON',
  'SYNC_JURISDICTION',
  'CORS_ORIGIN',
] as const;

describe('config/env', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  it('loads the full configuration from environment variables', async () => {
    vi.stubEnv('PORT', '4000');
    vi.stubEnv('OPENSTATES_API_URL', 'https://example.org');
    vi.stubEnv('OPENSTATES_API_TOKEN', 'test-token');
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/test');
    vi.stubEnv('SYNC_CRON', '0 6 * * *');
    vi.stubEnv('SYNC_JURISDICTION', 'GA');
    vi.stubEnv('CORS_ORIGIN', 'http://example.com');

    const { env } = await import('../src/config/env.js');

    expect(env).toEqual({
      port: 4000,
      openStatesApiUrl: 'https://example.org',
      openStatesApiToken: 'test-token',
      databaseUrl: 'postgres://localhost/test',
      syncCron: '0 6 * * *',
      syncJurisdiction: 'GA',
      corsOrigin: 'http://example.com',
    });
  });

  it('applies defaults for optional variables', async () => {
    vi.stubEnv('OPENSTATES_API_TOKEN', 'test-token');
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/test');

    const { env } = await import('../src/config/env.js');

    expect(env.port).toBe(3000);
    expect(env.openStatesApiUrl).toBe('https://v3.openstates.org');
    expect(env.syncCron).toBe('0 0 * * *');
    expect(env.syncJurisdiction).toBe('');
    expect(env.corsOrigin).toBe('http://localhost:5173');
  });

  it('falls back to the default port when PORT is not a number', async () => {
    vi.stubEnv('PORT', 'not-a-number');
    vi.stubEnv('OPENSTATES_API_TOKEN', 'test-token');
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/test');

    const { env } = await import('../src/config/env.js');

    expect(env.port).toBe(3000);
  });

  it('throws when OPENSTATES_API_TOKEN is missing', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/test');

    await expect(import('../src/config/env.js')).rejects.toThrow(
      'Missing required environment variable: OPENSTATES_API_TOKEN',
    );
  });

  it('throws when DATABASE_URL is missing', async () => {
    vi.stubEnv('OPENSTATES_API_TOKEN', 'test-token');

    await expect(import('../src/config/env.js')).rejects.toThrow(
      'Missing required environment variable: DATABASE_URL',
    );
  });
});