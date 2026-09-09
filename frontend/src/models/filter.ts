export interface PeopleFiltersState {
  state: string;
  party: string;
  page: number;
}

export type PeopleFilterAction =
  | { type: 'SET_STATE'; value: string }
  | { type: 'SET_PARTY'; value: string }
  | { type: 'SET_PAGE'; value: number }
  | { type: 'CLEAR' };

export interface PeopleFilterContextValue {
  state: PeopleFiltersState;
  setStateFilter: (state: string) => void;
  setPartyFilter: (party: string) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
}
