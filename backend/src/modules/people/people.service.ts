import type { PeopleRepository } from './people.repository.js';
import type {
  PeopleFiltersResponse,
  PeopleListResponse,
  PeopleQuery,
} from '../../models/people.js';

export interface PeopleService {
  list(query: PeopleQuery): Promise<PeopleListResponse>;
  listFilters(): Promise<PeopleFiltersResponse>;
}

export class DefaultPeopleService implements PeopleService {
  constructor(private readonly repository: PeopleRepository) {}

  async list(query: PeopleQuery): Promise<PeopleListResponse> {
    return this.repository.list({
      state: query.state || undefined,
      party: query.party || undefined,
      page: query.page,
      perPage: query.perPage,
    });
  }

  async listFilters(): Promise<PeopleFiltersResponse> {
    return this.repository.listFilters();
  }
}
