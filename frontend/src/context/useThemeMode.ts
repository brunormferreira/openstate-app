import { useContext } from 'react';
import { ThemeModeContext } from './themeModeContext';
import type { ThemeModeContextValue } from './themeModeContext';

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
