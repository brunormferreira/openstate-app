import { useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { PeopleFilterContext } from './peopleFilterContext';
import type { PeopleFilterContextValue } from '@/models/filter';
import { initialPeopleFilters, peopleFiltersReducer } from './people.filter.reducer';

export function PeopleFilterProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(peopleFiltersReducer, initialPeopleFilters);

  const value = useMemo<PeopleFilterContextValue>(
    () => ({
      state,
      setStateFilter: (value) => dispatch({ type: 'SET_STATE', value }),
      setPartyFilter: (value) => dispatch({ type: 'SET_PARTY', value }),
      setPage: (value) => dispatch({ type: 'SET_PAGE', value }),
      clearFilters: () => dispatch({ type: 'CLEAR' }),
    }),
    [state],
  );

  return <PeopleFilterContext.Provider value={value}>{children}</PeopleFilterContext.Provider>;
}
