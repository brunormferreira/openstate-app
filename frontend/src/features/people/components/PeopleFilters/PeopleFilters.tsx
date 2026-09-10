import styled from 'styled-components';
import { usePeopleFilter } from '@/context/PeopleFilterContext';

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const Select = styled.select`
  min-width: 150px;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  @media (min-width: 768px) {
    min-width: 190px;
    font-size: 14px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

const ClearButton = styled.button`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primarySoftText};
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

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
