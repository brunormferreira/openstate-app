import type {
  OpenStatesCompactJurisdiction,
  OpenStatesPerson,
} from '../../infra/openstates/openStates.types.js';

export function deriveState(jurisdiction: OpenStatesCompactJurisdiction): string | null {
  // OpenStates jurisdiction ids look like "ocd-jurisdiction/country:us/state:ga/government".
  const match = /state:([a-z]{2})\b/.exec(jurisdiction.id);
  if (match) {
    return match[1].toUpperCase();
  }
  return null;
}

export function normalizeDistrict(district: string | number | undefined): string | null {
  if (district === undefined || district === null || district === '') {
    return null;
  }
  return String(district);
}

export function toPersonEntity(person: OpenStatesPerson) {
  return {
    id: person.id,
    name: person.name,
    roleTitle: person.current_role?.title ?? 'Unknown',
    district: normalizeDistrict(person.current_role?.district),
    image: person.image || null,
    party: person.party || null,
    state: deriveState(person.jurisdiction),
    jurisdictionId: person.jurisdiction.id,
  };
}
