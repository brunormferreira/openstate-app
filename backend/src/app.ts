import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createPeopleRouter } from './modules/people/people.routes.js';
import { createSyncRouter } from './modules/sync/sync.routes.js';
import type { PeopleService } from './modules/people/people.service.js';
import type { SyncService } from './modules/sync/sync.service.js';
import { errorHandler, notFoundHandler } from './shared/middlewares/errorHandler.js';

interface AppDependencies {
  peopleService: PeopleService;
  syncService: SyncService;
  corsOrigin: string;
}

const JSON_BODY_LIMIT = '100kb';
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;

export function createApp(deps: AppDependencies): Express {
  const app = express();

  // Single nginx hop in front of the API, so rate limiting keys on the real client IP.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: deps.corsOrigin }));
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/people', createPeopleRouter(deps.peopleService));
  app.use('/api/sync', createSyncRouter(deps.syncService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
