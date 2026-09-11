import 'dotenv/config';

interface Env {
  port: number;
  openStatesApiUrl: string;
  openStatesApiToken: string;
  databaseUrl: string;
  syncCron: string;
  syncJurisdiction: string;
  corsOrigin: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function number(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function loadEnv(): Env {
  return {
    port: number('PORT', 3000),
    openStatesApiUrl: process.env.OPENSTATES_API_URL ?? 'https://v3.openstates.org',
    openStatesApiToken: required('OPENSTATES_API_TOKEN'),
    databaseUrl: required('DATABASE_URL'),
    syncCron: process.env.SYNC_CRON ?? '0 0 * * *',
    syncJurisdiction: process.env.SYNC_JURISDICTION ?? '',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  };
}

export const env: Env = loadEnv();
