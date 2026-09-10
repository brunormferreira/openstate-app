import { usePeopleFilter } from '@/context/PeopleFilterContext';
import { Bar, Label, Select, ClearButton } from './PeopleFilters.styles';

interface PeopleFiltersProps {
  readonly states: string[];
  readonly parties: string[];
  readonly isLoading?: boolean;
}

export function PeopleFilters({ states, parties, isLoading = false }: PeopleFiltersProps) {
  const { state, setStateFilter, setPartyFilter, clearFilters } = usePeopleFilter();

  return (
    <Bar>
      <Label>
        State
        <Select
          value={state.state}
          disabled={isLoading}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">{isLoading ? 'Loading...' : 'All states'}</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Label>

      <Label>
        Party
        <Select
          value={state.party}
          disabled={isLoading}
          onChange={(e) => setPartyFilter(e.target.value)}
        >
          <option value="">{isLoading ? 'Loading...' : 'All parties'}</option>
          {parties.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Label>

      {(state.state || state.party) && (
        <ClearButton type="button" onClick={clearFilters}>
          Clear filters
        </ClearButton>
      )}
    </Bar>
  );
}