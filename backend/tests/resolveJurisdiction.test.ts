import { describe, expect, it } from 'vitest';
import { resolveJurisdiction } from '../src/shared/utils/resolveJurisdiction.js';

describe('resolveJurisdiction', () => {
  it('passes through OCD jurisdiction IDs unchanged', () => {
    const input = 'ocd-jurisdiction/country:us/state:ga/government';
    expect(resolveJurisdiction(input)).toBe(input);
  });

  it('converts 2-letter state code to OCD ID', () => {
    expect(resolveJurisdiction('GA')).toBe('ocd-jurisdiction/country:us/state:ga/government');
    expect(resolveJurisdiction('nc')).toBe('ocd-jurisdiction/country:us/state:nc/government');
  });

  it('converts full state name to OCD ID', () => {
    expect(resolveJurisdiction('Georgia')).toBe('ocd-jurisdiction/country:us/state:ga/government');
    expect(resolveJurisdiction('north carolina')).toBe(
      'ocd-jurisdiction/country:us/state:nc/government',
    );
  });

  it('trims whitespace from input', () => {
    expect(resolveJurisdiction('  GA  ')).toBe('ocd-jurisdiction/country:us/state:ga/government');
  });

  it('returns null for unrecognized input', () => {
    expect(resolveJurisdiction('INVALIDSTATE')).toBeNull();
    expect(resolveJurisdiction('xyz')).toBeNull();
    expect(resolveJurisdiction('')).toBeNull();
  });
});
