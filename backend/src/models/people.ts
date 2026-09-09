import type { Person } from '@prisma/client';

export interface PeopleQuery {
  state?: string;
  party?: string;
  page?: number;
  perPage?: number;
}

export interface PeopleListResponse {
  items: Person[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PeopleFiltersResponse {
  states: string[];
  parties: string[];
}
