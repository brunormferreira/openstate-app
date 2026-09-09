import { createContext } from 'react';
import type { PeopleFilterContextValue } from '@/models/filter';

export const PeopleFilterContext = createContext<PeopleFilterContextValue | undefined>(undefined);
