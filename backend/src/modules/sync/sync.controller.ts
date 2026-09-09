import type { Request, Response } from 'express';
import { z } from 'zod';
import type { SyncService } from './sync.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';

const MAX_JURISDICTION_LENGTH = 200;

const syncQuerySchema = z.object({
  jurisdiction: z.string().trim().min(1).max(MAX_JURISDICTION_LENGTH),
});

export class SyncController {
  constructor(private readonly service: SyncService) {}

  async sync(req: Request, res: Response): Promise<void> {
    const parsed = syncQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError('jurisdiction is required', 400, 'BAD_REQUEST');
    }

    const { jurisdiction } = parsed.data;

    // Run in the background so the client responds immediately.
    this.service
      .run(jurisdiction)
      .then((result) => logger('Sync finished', JSON.stringify(result)))
      .catch((error) => logger('Sync failed', error));

    res.status(202).json({ message: 'Sync started', jurisdiction });
  }
}
