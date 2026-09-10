import styled from 'styled-components';
import { Pagination } from '@/components/Pagination/Pagination';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Spinner } from '@/components/Spinner';
import { PersonCard } from '@/features/people/components/PersonCard/PersonCard';
import type { PeopleListResponse } from '@/api/types';
import { apiErrorMessage } from '@/utils/apiErrorMessage';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.space(3)};

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.space(4)};
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: ${({ theme }) => theme.space(5)};
  }
`;

interface PeopleListContentProps {
  readonly isLoading: boolean;
  readonly error: unknown;
  readonly data?: PeopleListResponse;
  readonly hasActiveFilters: boolean;
  readonly onRetry: () => void;
  readonly onPageChange: (page: number) => void;
}

export function PeopleListContent({
  isLoading,
  error,
  data,
  hasActiveFilters,
  onRetry,
  onPageChange,
}: PeopleListContentProps) {
  if (isLoading) return <Spinner />;

  if (error) return <ErrorState message={apiErrorMessage(error)} onRetry={onRetry} />;

  if (!data) return null;

  if (data.items.length === 0) {
    return (
      <EmptyState
        title="No people found"
        message={
          hasActiveFilters
            ? 'No one matches these filters. Try clearing them.'
            : 'Nothing synced yet, or the sync is still running. Sync a jurisdiction above and refresh.'
        }
        actionLabel="Refresh"
        onAction={onRetry}
      />
    );
  }

  return (
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
