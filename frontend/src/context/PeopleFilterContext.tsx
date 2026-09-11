import { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { initialPeopleFilters, peopleFiltersReducer } from './peopleFilterReducer';

export interface PeopleFiltersState {
  state: string;
  party: string;
  page: number;
  perPage: number;
}

export type PeopleFilterAction =
  | { type: 'SET_STATE'; value: string }
  | { type: 'SET_PARTY'; value: string }
  | { type: 'SET_PAGE'; value: number }
  | { type: 'SET_PER_PAGE'; value: number }
  | { type: 'CLEAR' };

interface PeopleFilterContextValue {
  state: PeopleFiltersState;
  setStateFilter: (state: string) => void;
  setPartyFilter: (party: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  clearFilters: () => void;
}

const PeopleFilterContext = createContext<PeopleFilterContextValue | undefined>(undefined);

export function PeopleFilterProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(peopleFiltersReducer, initialPeopleFilters);

  const value = useMemo<PeopleFilterContextValue>(
    () => ({
      state,
      setStateFilter: (value) => dispatch({ type: 'SET_STATE', value }),
      setPartyFilter: (value) => dispatch({ type: 'SET_PARTY', value }),
      setPage: (value) => dispatch({ type: 'SET_PAGE', value }),
      setPerPage: (value) => dispatch({ type: 'SET_PER_PAGE', value }),
      clearFilters: () => dispatch({ type: 'CLEAR' }),
    }),
    [state],
  );

  return <PeopleFilterContext.Provider value={value}>{children}</PeopleFilterContext.Provider>;
}

export function usePeopleFilter(): PeopleFilterContextValue {
  const context = useContext(PeopleFilterContext);
  if (!context) {
    throw new Error('usePeopleFilter must be used within a PeopleFilterProvider');
  }
  return context;
}
