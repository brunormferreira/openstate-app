import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './infra/database/prisma.js';
import { HttpOpenStatesClient } from './infra/openstates/openStatesClient.js';
import { peopleRepository } from './modules/people/people.repository.js';
import { DefaultPeopleService } from './modules/people/people.service.js';
import { syncRepository } from './modules/sync/sync.repository.js';
import { DefaultSyncService } from './modules/sync/sync.service.js';
import { SyncScheduler } from './modules/sync/sync.scheduler.js';
import { logger } from './shared/utils/logger.js';

function bootstrap(): void {
  const openStatesClient = new HttpOpenStatesClient(
    env.openStatesApiUrl,
    env.openStatesApiToken,
  );

  const peopleService = new DefaultPeopleService(peopleRepository);
  const syncService = new DefaultSyncService(openStatesClient, syncRepository);

  const scheduler = new SyncScheduler(syncService, env.syncCron, env.syncJurisdiction);
  scheduler.start();

  const app = createApp({
    peopleService,
    syncService,
    corsOrigin: env.corsOrigin,
  });

  const server = app.listen(env.port, () => {
    logger(`OpenStates backend listening on http://localhost:${env.port}`);
  });

  const shutdown = () => {
    logger('Shutting down');
    scheduler.stop();
    server.close();
    void prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();
