import type { ReactNode } from 'react';
import { Pagination } from '@/components/Pagination/Pagination';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { FullScreenLoader } from '@/components/FullScreenLoader/FullScreenLoader';
import { PersonCard } from '@/features/people/components/PersonCard/PersonCard';
import type { PeopleListResponse } from '@/api/types';
import { apiErrorMessage } from '@/utils/apiErrorMessage';
import { Grid } from './PeopleListContent.styles';

interface PeopleListContentProps {
  readonly isInitialLoading: boolean;
  readonly isRefreshing: boolean;
  readonly isSyncing: boolean;
  readonly error: unknown;
  readonly data?: PeopleListResponse;
  readonly hasActiveFilters: boolean;
  readonly onRetry: () => void;
  readonly onPageChange: (page: number) => void;
}

export function PeopleListContent({
  isInitialLoading,
  isRefreshing,
  isSyncing,
  error,
  data,
  hasActiveFilters,
  onRetry,
  onPageChange,
}: PeopleListContentProps) {
  const loading = isInitialLoading || isRefreshing || isSyncing;

  let content: ReactNode;
  if (error && !data) {
    content = <ErrorState message={apiErrorMessage(error)} onRetry={onRetry} />;
  } else if (!data) {
    content = null;
  } else if (data.items.length === 0) {
    if (hasActiveFilters) {
      content = (
        <EmptyState
          title="No people found"
          message="No one matches these filters. Try clearing them."
        />
      );
    } else {
      content = (
        <EmptyState
          title="No people found"
          message="Nothing synced yet. Use the panel above to sync a jurisdiction."
        />
      );
    }
  } else {
    content = (
      <>
        <Grid>
          {data.items.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </Grid>
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={onPageChange} />
      </>
    );
  }

  return (
    <>
      {loading && <FullScreenLoader />}
      {!isInitialLoading && content}
    </>
  );
}