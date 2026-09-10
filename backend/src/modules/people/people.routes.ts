import { Router } from 'express';
import type { PeopleService } from './people.service.js';
import { PeopleController } from './people.controller.js';

export function createPeopleRouter(service: PeopleService): Router {
  const router = Router();
  const controller = new PeopleController(service);

  router.get('/', (req, res) => controller.list(req, res));
  router.get('/filters', (req, res) => controller.listFilters(req, res));

  return router;
}
