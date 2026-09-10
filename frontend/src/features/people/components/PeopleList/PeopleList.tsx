import styled from 'styled-components';
import { usePeople, usePeopleFilters } from '@/features/people/hooks/usePeople';
import { usePeopleFilter } from '@/context/PeopleFilterContext';
import { PeopleFilters } from '@/features/people/components/PeopleFilters/PeopleFilters';
import { SyncPanel } from '@/features/people/components/SyncPanel/SyncPanel';
import { PeopleListContent } from './PeopleListContent';

const PER_PAGE = 20;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const Count = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

export function PeopleList() {
  const { state, setPage } = usePeopleFilter();
  const filtersQuery = usePeopleFilters();

  const peopleQuery = usePeople({
    state: state.state || undefined,
    party: state.party || undefined,
    page: state.page,
    perPage: PER_PAGE,
  });

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Sections>
      <SyncPanel />

      <PeopleFilters
        states={filtersQuery.data?.states ?? []}
        parties={filtersQuery.data?.parties ?? []}
        isLoading={filtersQuery.isLoading}
      />

      <Toolbar>
        <SectionTitle>Representatives</SectionTitle>
        {peopleQuery.data && <Count>{peopleQuery.data.total} people</Count>}
      </Toolbar>

      <PeopleListContent
        isLoading={peopleQuery.isLoading}
        error={peopleQuery.error}
        data={peopleQuery.data}
        hasActiveFilters={Boolean(state.state || state.party)}
        onRetry={() => void peopleQuery.refetch()}
        onPageChange={handlePageChange}
      />
    </Sections>
  );
}
