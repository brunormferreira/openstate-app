export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    bg: string;
    bgAccent: string;
    surface: string;
    surfaceMuted: string;
    surfaceHover: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    primary: string;
    primaryHover: string;
    primaryContrast: string;
    primarySoft: string;
    primarySoftText: string;
    success: string;
    danger: string;
    focusRing: string;
    photoFrom: string;
    photoTo: string;
    party: {
      democratic: string;
      republican: string;
      independent: string;
      other: string;
    };
  };
  radii: { sm: string; md: string; lg: string; pill: string };
  space: (steps: number) => string;
  shadows: { card: string; cardHover: string; panel: string };
  transition: string;
}

const SPACE_UNIT = 4;

const shared = {
  radii: { sm: '6px', md: '10px', lg: '16px', pill: '999px' },
  space: (steps: number) => `${steps * SPACE_UNIT}px`,
  transition: '180ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const lightTheme: AppTheme = {
  ...shared,
  mode: 'light',
  colors: {
    bg: '#f8f9fb',
    bgAccent: 'radial-gradient(1200px 480px at 50% -10%, #e8ecf4 0%, transparent 70%)',
    surface: '#ffffff',
    surfaceMuted: '#f4f5f7',
    surfaceHover: '#eef0f3',
    border: '#e0e3e8',
    borderStrong: '#c8ccd3',
    text: '#1a1d23',
    textMuted: '#4b5563',
    textSubtle: '#7c8594',
    primary: '#5b6b7f',
    primaryHover: '#475868',
    primaryContrast: '#ffffff',
    primarySoft: '#eef1f5',
    primarySoftText: '#4b5e70',
    success: '#567d46',
    danger: '#a54040',
    focusRing: 'rgba(91, 107, 127, 0.25)',
    photoFrom: '#f0f1f4',
    photoTo: '#e4e6eb',
    party: {
      democratic: '#7c8ea2',
      republican: '#a0887a',
      independent: '#8b9099',
      other: '#7d7872',
    },
  },
  shadows: {
    card: '0 1px 3px rgba(26, 29, 35, 0.04), 0 4px 12px rgba(26, 29, 35, 0.05)',
    cardHover: '0 6px 20px rgba(26, 29, 35, 0.10)',
    panel: '0 1px 4px rgba(26, 29, 35, 0.06)',
  },
};

export const darkTheme: AppTheme = {
  ...shared,
  mode: 'dark',
  colors: {
    bg: '#0e1219',
    bgAccent: 'radial-gradient(1200px 480px at 50% -10%, #182030 0%, transparent 70%)',
    surface: '#151b25',
    surfaceMuted: '#1a2130',
    surfaceHover: '#1f2838',
    border: '#252e3d',
    borderStrong: '#364050',
    text: '#e2e5ea',
    textMuted: '#9aa1b0',
    textSubtle: '#6b7280',
    primary: '#7ea2c7',
    primaryHover: '#a3bfe0',
    primaryContrast: '#0e1219',
    primarySoft: '#1c2636',
    primarySoftText: '#a3bfe0',
    success: '#6fc27a',
    danger: '#e88a8a',
    focusRing: 'rgba(126, 162, 199, 0.35)',
    photoFrom: '#1a2130',
    photoTo: '#121820',
    party: {
      democratic: '#7ea2c7',
      republican: '#c99a8a',
      independent: '#9ba3b4',
      other: '#8a9490',
    },
  },
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.3)',
    cardHover: '0 8px 28px rgba(0, 0, 0, 0.5)',
    panel: '0 1px 4px rgba(0, 0, 0, 0.35)',
  },
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export function partyColor(theme: AppTheme, party: string | null): string {
  const normalized = party?.toLowerCase() ?? '';
  if (normalized.includes('democrat')) return theme.colors.party.democratic;
  if (normalized.includes('republican')) return theme.colors.party.republican;
  if (normalized.includes('independent')) return theme.colors.party.independent;
  return theme.colors.party.other;
}
