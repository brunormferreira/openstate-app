import type { PeopleFiltersState, PeopleFilterAction } from '@/models/filter';

export type { PeopleFiltersState, PeopleFilterAction };

export const initialPeopleFilters: PeopleFiltersState = {
  state: '',
  party: '',
  page: 1,
};

export function peopleFiltersReducer(
  state: PeopleFiltersState,
  action: PeopleFilterAction,
): PeopleFiltersState {
  switch (action.type) {
    // Changing a filter invalidates the current page.
    case 'SET_STATE':
      return { ...state, state: action.value, page: 1 };
    case 'SET_PARTY':
      return { ...state, party: action.value, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.value };
    case 'CLEAR':
      return initialPeopleFilters;
    default:
      return state;
  }
}
