import { describe, expect, it } from 'vitest';
import { deriveState, normalizeDistrict, toPersonEntity } from '../src/modules/sync/sync.mapper.js';
import type { OpenStatesPerson } from '../src/infra/openstates/openStates.types.js';

function buildPerson(overrides: Partial<OpenStatesPerson> = {}): OpenStatesPerson {
  return {
    id: 'ocd-person/123',
    name: 'Jane Doe',
    party: 'Democratic',
    jurisdiction: { id: 'ocd-jurisdiction/country:us/state:nc/government', name: 'North Carolina', classification: 'state' },
    given_name: 'Jane',
    family_name: 'Doe',
    ...overrides,
  };
}

describe('deriveState', () => {
  it('extracts the two-letter state code from jurisdiction id', () => {
    expect(
      deriveState({ id: 'ocd-jurisdiction/country:us/state:nc/government', name: 'North Carolina', classification: 'state' }),
    ).toBe('NC');
  });

  it('returns null for jurisdictions without a state', () => {
    expect(
      deriveState({ id: 'ocd-jurisdiction/country:us/government', name: 'United States', classification: 'country' }),
    ).toBeNull();
  });
});

describe('normalizeDistrict', () => {
  it('returns the string form of a numeric district', () => {
    expect(normalizeDistrict(3)).toBe('3');
  });

  it('returns the value for string districts', () => {
    expect(normalizeDistrict('106')).toBe('106');
  });

  it('returns null for empty/undefined districts', () => {
    expect(normalizeDistrict(undefined)).toBeNull();
    expect(normalizeDistrict('')).toBeNull();
  });
});

describe('toPersonEntity', () => {
  it('maps a person with a current role', () => {
    const person = buildPerson({
      current_role: { title: 'Senator', org_classification: 'upper', district: 3, division_id: 'ocd-division/country:us/state:nc/sldu:3' },
      image: 'https://example.com/jane.png',
    });

    expect(toPersonEntity(person)).toEqual({
      id: 'ocd-person/123',
      name: 'Jane Doe',
      roleTitle: 'Senator',
      district: '3',
      image: 'https://example.com/jane.png',
      party: 'Democratic',
      state: 'NC',
      jurisdictionId: 'ocd-jurisdiction/country:us/state:nc/government',
    });
  });

  it('falls back when role and image are missing', () => {
    const person = buildPerson({ current_role: undefined, image: '' });
    const entity = toPersonEntity(person);

    expect(entity.roleTitle).toBe('Unknown');
    expect(entity.image).toBeNull();
    expect(entity.district).toBeNull();
  });
});
