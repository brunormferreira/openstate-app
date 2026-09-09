export interface SyncResult {
  jurisdiction: string;
  peopleUpserted: number;
}

export interface PersonSegment {
  id: string;
  name: string;
  roleTitle: string;
  district: string | null;
  image: string | null;
  party: string | null;
  state: string | null;
  jurisdictionId: string;
}
