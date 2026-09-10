export interface Person {
  id: string;
  name: string;
  roleTitle: string;
  district: string | null;
  image: string | null;
  party: string | null;
  state: string | null;
  jurisdictionId: string;
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

export interface PeopleQuery {
  state?: string;
  party?: string;
  page?: number;
  perPage?: number;
}
