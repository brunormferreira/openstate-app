import { Router } from 'express';
import type { PeopleService } from './people.service.js';
import { PeopleController } from './people.controller.js';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js';

export function createPeopleRouter(service: PeopleService): Router {
  const router = Router();
  const controller = new PeopleController(service);

  router.get('/', asyncHandler((req, res) => controller.list(req, res)));
  router.get('/filters', asyncHandler((req, res) => controller.listFilters(req, res)));

  return router;
}
