import { prisma } from '../../infra/database/prisma.js';
import type { PersonSegment } from '../../models/sync.js';

export interface SyncRepository {
  upsertMany(people: PersonSegment[]): Promise<number>;
}

/** Keeps each transaction short enough to avoid holding locks for the whole batch. */
const CHUNK_SIZE = 100;

export class PrismaSyncRepository implements SyncRepository {
  async upsertMany(people: PersonSegment[]): Promise<number> {
    if (people.length === 0) return 0;

    let updated = 0;
    for (let start = 0; start < people.length; start += CHUNK_SIZE) {
      const chunk = people.slice(start, start + CHUNK_SIZE);

      await prisma.$transaction(
        chunk.map((person) =>
          prisma.person.upsert({
            where: { id: person.id },
            update: {
              name: person.name,
              roleTitle: person.roleTitle,
              district: person.district,
              image: person.image,
              party: person.party,
              state: person.state,
              jurisdictionId: person.jurisdictionId,
            },
            create: person,
          }),
        ),
      );

      updated += chunk.length;
    }

    return updated;
  }
}

export const syncRepository: SyncRepository = new PrismaSyncRepository();
