import type { Request, Response } from 'express';
import { z } from 'zod';
import type { PeopleService } from './people.service.js';
import { AppError } from '../../shared/errors/AppError.js';

const MIN_PAGE = 1;
const DEFAULT_PAGE = 1;
const MIN_PER_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;
const MAX_FILTER_LENGTH = 100;

const optionalFilter = z
  .string()
  .trim()
  .max(MAX_FILTER_LENGTH)
  .optional()
  .catch(undefined)
  .transform((value) => value || undefined);

// Malformed or out-of-range values fall back to defaults instead of rejecting the request.
const listQuerySchema = z.object({
  state: optionalFilter,
  party: optionalFilter,
  page: z.coerce
    .number()
    .int()
    .catch(DEFAULT_PAGE)
    .transform((value) => Math.max(MIN_PAGE, value)),
  perPage: z.coerce
    .number()
    .int()
    .catch(DEFAULT_PER_PAGE)
    .transform((value) => Math.min(MAX_PER_PAGE, Math.max(MIN_PER_PAGE, value))),
});

export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  async list(req: Request, res: Response): Promise<void> {
    const parsed = listQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError(
        `Invalid query parameters: ${parsed.error.issues.map((i) => i.message).join(', ')}`,
        400,
        'BAD_REQUEST',
      );
    }

    const result = await this.service.list(parsed.data);
    res.json(result);
  }

  async listFilters(_req: Request, res: Response): Promise<void> {
    const result = await this.service.listFilters();
    res.json(result);
  }
}
