import type { Request, Response } from 'express';
import { z } from 'zod';
import type { SyncService } from './sync.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { resolveJurisdiction } from '../../shared/utils/resolveJurisdiction.js';

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
    const parsedJurisdiction = resolveJurisdiction(jurisdiction);

    if (!parsedJurisdiction) {
      throw new AppError(
        'Invalid jurisdiction. Use a 2-letter state code (e.g. ga), full name (e.g. california), or OCD id (e.g. ocd-jurisdiction/country:us/state:ga/government)',
        400,
        'BAD_REQUEST',
      );
    }

    // Runs synchronously and returns once the data is persisted, so errors
    // (e.g. an upstream rate limit) surface to the caller as a normal response.
    const startedAt = Date.now();
    const { peopleUpserted } = await this.service.run(parsedJurisdiction);

    res.status(200).json({
      jurisdiction: parsedJurisdiction,
      peopleUpserted,
      durationMs: Date.now() - startedAt,
    });
  }
}
