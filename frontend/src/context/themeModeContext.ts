import { createContext } from 'react';
import type { ThemeMode } from '@/styles/theme';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);
