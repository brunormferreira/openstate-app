export interface OpenStatesPerson {
  id: string;
  name: string;
  party?: string;
  current_role?: OpenStatesCurrentRole;
  jurisdiction: OpenStatesCompactJurisdiction;
  given_name: string;
  family_name: string;
  image?: string | null;
  email?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
  openstates_url?: string;
}

export interface OpenStatesCurrentRole {
  title: string;
  org_classification: string;
  district?: string | number;
  division_id: string;
}

export interface OpenStatesCompactJurisdiction {
  id: string;
  name: string;
  classification: string;
}

export interface OpenStatesPagination {
  per_page: number;
  page: number;
  max_page: number;
  total_items: number;
}

export interface OpenStatesPersonList {
  results: OpenStatesPerson[];
  pagination: OpenStatesPagination;
}
