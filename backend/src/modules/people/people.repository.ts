import type { Person, Prisma } from '@prisma/client';
import { prisma } from '../../infra/database/prisma.js';

export interface PeopleListResult {
  items: Person[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PeopleFiltersResult {
  states: string[];
  parties: string[];
}

export interface PeopleRepository {
  list(params: {
    state?: string;
    party?: string;
    page?: number;
    perPage?: number;
  }): Promise<PeopleListResult>;
  listFilters(): Promise<PeopleFiltersResult>;
}

export class PrismaPeopleRepository implements PeopleRepository {
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
  }): Promise<PeopleListResult> {
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

  async listFilters(): Promise<PeopleFiltersResult> {
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
        .sort(),
      parties: parties
        .map((p) => p.party)
        .filter((p): p is string => p !== null)
        .sort(),
    };
  }
}

export const peopleRepository: PeopleRepository = new PrismaPeopleRepository();
