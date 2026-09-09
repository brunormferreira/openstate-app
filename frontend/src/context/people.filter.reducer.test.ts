import { describe, it, expect } from 'vitest';
import {
  peopleFiltersReducer,
  initialPeopleFilters,
} from './people.filter.reducer';

describe('peopleFiltersReducer', () => {
  it('returns the initial state by default', () => {
    expect(initialPeopleFilters).toEqual({ state: '', party: '', page: 1 });
  });

  it('SET_STATE updates state and resets page to 1', () => {
    const state = { state: 'GA', party: 'Republican', page: 5 };
    const next = peopleFiltersReducer(state, {
      type: 'SET_STATE',
      value: 'CA',
    });
    expect(next).toEqual({ state: 'CA', party: 'Republican', page: 1 });
  });

  it('SET_PARTY updates party and resets page to 1', () => {
    const state = { state: 'GA', party: 'Republican', page: 3 };
    const next = peopleFiltersReducer(state, {
      type: 'SET_PARTY',
      value: 'Democratic',
    });
    expect(next).toEqual({ state: 'GA', party: 'Democratic', page: 1 });
  });

  it('SET_PAGE updates only the page', () => {
    const state = { state: 'GA', party: 'Republican', page: 1 };
    const next = peopleFiltersReducer(state, { type: 'SET_PAGE', value: 10 });
    expect(next).toEqual({ state: 'GA', party: 'Republican', page: 10 });
  });

  it('CLEAR resets everything to initial', () => {
    const state = { state: 'GA', party: 'Republican', page: 10 };
    const next = peopleFiltersReducer(state, { type: 'CLEAR' });
    expect(next).toEqual(initialPeopleFilters);
  });

  it('unknown action returns current state unchanged', () => {
    const state = { state: 'GA', party: 'R', page: 2 };
    const next = peopleFiltersReducer(state, {
      type: 'UNKNOWN' as 'SET_STATE',
      value: 'x',
    });
    expect(next).toBe(state);
  });
});
