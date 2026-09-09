import type { OpenStatesClient } from '../../infra/openstates/openStatesClient.js';
import { logger } from '../../shared/utils/logger.js';
import { sleep } from '../../shared/utils/sleep.js';
import type { SyncRepository } from './sync.repository.js';
import type { SyncResult } from '../../models/sync.js';
import { toPersonEntity } from './sync.mapper.js';

export interface SyncService {
  run(jurisdiction: string): Promise<SyncResult>;
}

/** Upper bound mirroring the client page cap, so the loop can never run away. */
const MAX_PAGES = 50;
const PAGE_DELAY_MS = 300;

export class DefaultSyncService implements SyncService {
  constructor(
    private readonly openStates: OpenStatesClient,
    private readonly repository: SyncRepository,
  ) {}

  async run(jurisdiction: string): Promise<SyncResult> {
    let peopleUpserted = 0;

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const data = await this.openStates.listPeopleByJurisdiction(jurisdiction, page);
      const entities = data.results.map(toPersonEntity);

      if (entities.length > 0) {
        peopleUpserted += await this.repository.upsertMany(entities);
      }

      if (page >= data.pagination.max_page) {
        break;
      }
      await sleep(PAGE_DELAY_MS);
    }

    logger(`Synced jurisdiction "${jurisdiction}" (${peopleUpserted} people)`);
    return { jurisdiction, peopleUpserted };
  }
}
