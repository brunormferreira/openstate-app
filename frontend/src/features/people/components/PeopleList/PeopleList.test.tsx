import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { PeopleFilterProvider } from '@/context/PeopleFilterContext';
import { SyncProvider } from '@/context/SyncContext';
import { PeopleList } from './PeopleList';

vi.mock('@/features/people/hooks/usePeople', () => ({
  usePeople: vi.fn(() => ({
    data: { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 },
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
  })),
  usePeopleFilters: vi.fn(() => ({
    data: { states: ['GA', 'NC'], parties: ['Dem', 'Rep'] },
    isLoading: false,
  })),
}));

vi.mock('@/features/people/components/SyncPanel/SyncPanel', () => ({
  SyncPanel: () => <div data-testid="sync-panel" />,
}));

vi.mock('@/features/people/components/PeopleFilters/PeopleFilters', () => ({
  PeopleFilters: (props: { states: string[]; parties: string[] }) => (
    <div data-testid="people-filters" data-states={props.states.join(',')} />
  ),
}));

vi.mock('@/features/people/components/PeopleList/PeopleListContent', () => ({
  PeopleListContent: (props: { data?: { total: number } }) => (
    <div data-testid="people-list-content" data-total={props.data?.total ?? 0} />
  ),
}));

function renderPeopleList() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <PeopleFilterProvider>
          <SyncProvider>
            <PeopleList />
          </SyncProvider>
        </PeopleFilterProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('PeopleList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the section title', () => {
    renderPeopleList();
    expect(screen.getByText('Representatives')).toBeInTheDocument();
  });

  it('renders the sync panel', () => {
    renderPeopleList();
    expect(screen.getByTestId('sync-panel')).toBeInTheDocument();
  });

  it('renders the people filters', () => {
    renderPeopleList();
    expect(screen.getByTestId('people-filters')).toBeInTheDocument();
  });

  it('renders the people list content', () => {
    renderPeopleList();
    expect(screen.getByTestId('people-list-content')).toBeInTheDocument();
  });
});
