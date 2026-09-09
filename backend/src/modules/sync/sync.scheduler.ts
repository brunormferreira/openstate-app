import cron from 'node-cron';
import { logger } from '../../shared/utils/logger.js';
import type { SyncService } from './sync.service.js';

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
      logger(`Running scheduled sync for "${this.jurisdiction}"`);
      this.service
        .run(this.jurisdiction)
        .catch((error) => logger('Scheduled sync failed', error))
        .finally(() => {
          this.isRunning = false;
        });
    });

    logger(`Scheduled sync for "${this.jurisdiction}" with cron "${this.cronExpression}"`);
  }

  stop(): void {
    this.task?.stop();
  }
}
