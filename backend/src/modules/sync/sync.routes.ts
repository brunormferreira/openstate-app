import { Router } from 'express';
import type { SyncService } from './sync.service.js';
import { SyncController } from './sync.controller.js';

export function createSyncRouter(service: SyncService): Router {
  const router = Router();
  const controller = new SyncController(service);

  router.post('/', (req, res) => controller.sync(req, res));

  return router;
}
