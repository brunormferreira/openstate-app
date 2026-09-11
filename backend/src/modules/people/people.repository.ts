import type { Prisma } from '@prisma/client';
import { prisma } from '../../infra/database/prisma.js';
import type { PeopleListResponse, PeopleFiltersResponse } from '../../models/people.js';

export interface PeopleRepository {
  list(params: {
    state?: string;
    party?: string;
    page?: number;
    perPage?: number;
  }): Promise<PeopleListResponse>;
  listFilters(): Promise<PeopleFiltersResponse>;
}

class PrismaPeopleRepository implements PeopleRepository {
  private buildWhere(params: { state?: string; party?: string }): Prisma.PersonWhereInput {
    const where: Prisma.PersonWhereInput = {};
    if (params.state) {
      where.state = params.state;
    }
    if (params.party) {
      where.party = params.party;
    }
    return where;
  }

  async list(params: {
    state?: string;
    party?: string;
    page?: number;
    perPage?: number;
  }): Promise<PeopleListResponse> {
    const where = this.buildWhere(params);
    const perPage = params.perPage ?? 20;
    const page = params.page ?? 1;
    const skip = (page - 1) * perPage;

    const [items, total] = await prisma.$transaction([
      prisma.person.findMany({ where, orderBy: { name: 'asc' }, skip, take: perPage }),
      prisma.person.count({ where }),
    ]);

    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  async listFilters(): Promise<PeopleFiltersResponse> {
    // Using distinct on the columns avoids fetching large row sets.
    const [states, parties] = await prisma.$transaction([
      prisma.person.findMany({
        select: { state: true },
        distinct: ['state'],
        where: { state: { not: null } },
      }),
      prisma.person.findMany({
        select: { party: true },
        distinct: ['party'],
        where: { party: { not: null } },
      }),
    ]);

    return {
      states: states
        .map((s) => s.state)
        .filter((s): s is string => s !== null)
        .sort((a, b) => a.localeCompare(b)),
      parties: parties
        .map((p) => p.party)
        .filter((p): p is string => p !== null)
        .sort((a, b) => a.localeCompare(b)),
    };
  }
}

export const peopleRepository: PeopleRepository = new PrismaPeopleRepository();
