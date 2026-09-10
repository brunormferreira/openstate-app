import cron from 'node-cron';
import { logger } from '../../shared/utils/logger.js';
import type { SyncService } from './sync.service.js';
import { resolveJurisdiction } from '../../shared/utils/resolveJurisdiction.js';

export class SyncScheduler {
  private task?: cron.ScheduledTask;
  private isRunning = false;

  constructor(
    private readonly service: SyncService,
    private readonly cronExpression: string,
    private readonly jurisdiction: string,
  ) {}

  start(): void {
    if (!this.jurisdiction) {
      logger('Scheduled sync disabled (no SYNC_JURISDICTION set)');
      return;
    }

    const parsedJurisdiction = resolveJurisdiction(this.jurisdiction);

    if (!parsedJurisdiction) {
      logger(`Invalid SYNC_JURISDICTION: "${this.jurisdiction}". Use a 2-letter state code, full name, or OCD id.`);
      return;
    }

    if (!cron.validate(this.cronExpression)) {
      logger(`Invalid sync cron expression: "${this.cronExpression}"`);
      return;
    }

    this.task = cron.schedule(this.cronExpression, () => {
      if (this.isRunning) {
        logger('Skipping scheduled sync: previous run still in progress');
        return;
      }

      this.isRunning = true;
      logger(`Running scheduled sync for "${parsedJurisdiction}"`);
      this.service
        .run(parsedJurisdiction)
        .catch((error) => logger('Scheduled sync failed', error))
        .finally(() => {
          this.isRunning = false;
        });
    });

    logger(`Scheduled sync for "${parsedJurisdiction}" with cron "${this.cronExpression}"`);
  }

  stop(): void {
    this.task?.stop();
  }
}
