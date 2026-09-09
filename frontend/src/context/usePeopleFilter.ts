import { useContext } from 'react';
import { PeopleFilterContext } from './peopleFilterContext';
import type { PeopleFilterContextValue } from '@/models/filter';

export function usePeopleFilter(): PeopleFilterContextValue {
  const context = useContext(PeopleFilterContext);
  if (!context) {
    throw new Error('usePeopleFilter must be used within a PeopleFilterProvider');
  }
  return context;
}
