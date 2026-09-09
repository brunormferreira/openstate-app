import { describe, it, expect } from 'vitest';
import { partyColor, lightTheme, darkTheme } from './theme';
import type { AppTheme } from './theme';

function themeWith(
  overrides: Partial<AppTheme['colors']['party']>,
): AppTheme {
  return {
    ...lightTheme,
    colors: { ...lightTheme.colors, party: { ...lightTheme.colors.party, ...overrides } },
  };
}

describe('partyColor', () => {
  it('returns democratic color when party contains "democrat"', () => {
    expect(partyColor(lightTheme, 'Democrat')).toBe(lightTheme.colors.party.democratic);
    expect(partyColor(lightTheme, 'Democratic')).toBe(lightTheme.colors.party.democratic);
  });

  it('returns republican color when party contains "republican"', () => {
    expect(partyColor(lightTheme, 'Republican')).toBe(lightTheme.colors.party.republican);
  });

  it('returns independent color when party contains "independent"', () => {
    expect(partyColor(lightTheme, 'Independent')).toBe(lightTheme.colors.party.independent);
  });

  it('returns other color for unknown party', () => {
    expect(partyColor(lightTheme, 'Libertarian')).toBe(lightTheme.colors.party.other);
    expect(partyColor(lightTheme, 'Green')).toBe(lightTheme.colors.party.other);
  });

  it('returns other color for null party', () => {
    expect(partyColor(lightTheme, null)).toBe(lightTheme.colors.party.other);
  });

  it('is case-insensitive', () => {
    const t = themeWith({ democratic: '#aaa' });
    expect(partyColor(t, 'DEMOCRAT')).toBe('#aaa');
    expect(partyColor(t, 'republican')).toBe(lightTheme.colors.party.republican);
  });
});

describe('theme structure', () => {
  it('light and dark have matching color keys', () => {
    const lightKeys = Object.keys(lightTheme.colors).sort();
    const darkKeys = Object.keys(darkTheme.colors).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('space() returns scaled px value', () => {
    expect(lightTheme.space(0)).toBe('0px');
    expect(lightTheme.space(1)).toBe('4px');
    expect(lightTheme.space(5)).toBe('20px');
  });
});
