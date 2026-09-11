import { usePeople, usePeopleFilters } from '@/features/people/hooks/usePeople';
import { usePeopleFilter } from '@/context/PeopleFilterContext';
import { useSync } from '@/context/SyncContext';
import { PeopleFilters } from '@/features/people/components/PeopleFilters/PeopleFilters';
import { SyncPanel } from '@/features/people/components/SyncPanel/SyncPanel';
import { PeopleListContent } from './PeopleListContent';
import { Sections, Toolbar, SectionTitle, Count } from './PeopleList.styles';

export function PeopleList() {
  const { state, setPage, setPerPage } = usePeopleFilter();
  const { isSyncing } = useSync();
  const filtersQuery = usePeopleFilters();

  const peopleQuery = usePeople({
    state: state.state || undefined,
    party: state.party || undefined,
    page: state.page,
    perPage: state.perPage,
  });

  const isInitialLoading = peopleQuery.isLoading;
  const isRefreshing = peopleQuery.isFetching && !peopleQuery.isLoading;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (nextPerPage: number) => {
    setPerPage(nextPerPage);
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
        isInitialLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        isSyncing={isSyncing}
        error={peopleQuery.error}
        data={peopleQuery.data}
        hasActiveFilters={Boolean(state.state || state.party)}
        onRetry={() => void peopleQuery.refetch()}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </Sections>
  );
}