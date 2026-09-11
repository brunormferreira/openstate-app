import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { PeopleListContent } from './PeopleListContent';
import type { PeopleListResponse } from '@/api/types';

const defaultProps = {
  isInitialLoading: false,
  isRefreshing: false,
  isSyncing: false,
  error: null as unknown,
  data: undefined as PeopleListResponse | undefined,
  hasActiveFilters: false,
  onRetry: vi.fn(),
  onPageChange: vi.fn(),
  onPerPageChange: vi.fn(),
};

function renderContent(props: Partial<typeof defaultProps> = {}) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <PeopleListContent {...defaultProps} {...props} />
    </ThemeProvider>,
  );
}

describe('PeopleListContent', () => {
  it('shows FullScreenLoader when initial loading', () => {
    renderContent({ isInitialLoading: true });
    const statuses = screen.getAllByRole('status');
    expect(statuses.length).toBeGreaterThanOrEqual(1);
  });

  it('shows error state when error and no data', () => {
    renderContent({ error: 'Network error' });
    expect(screen.getByText('Unexpected error.')).toBeInTheDocument();
  });

  it('shows empty state with no people and no filters', () => {
    renderContent({ data: { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 } });
    expect(screen.getByText('No people found')).toBeInTheDocument();
    expect(screen.getByText(/Nothing synced yet/)).toBeInTheDocument();
  });

  it('shows empty state with filters active', () => {
    renderContent({
      data: { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 },
      hasActiveFilters: true,
    });
    expect(screen.getByText(/No one matches these filters/)).toBeInTheDocument();
  });

  it('renders person cards when data has items', () => {
    renderContent({
      data: {
        items: [
          {
            id: '1',
            name: 'Alice Smith',
            state: 'GA',
            party: 'Democratic',
            roleTitle: 'Senator',
            district: '1',
            image: null,
            jurisdictionId: 'ocd-jurisdiction/country:us/state:ga/government',
          },
        ],
        total: 1,
        page: 1,
        perPage: 20,
        totalPages: 1,
      },
    });
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('shows refreshing loader when refreshing', () => {
    renderContent({
      isRefreshing: true,
      data: { items: [], total: 0, page: 1, perPage: 20, totalPages: 0 },
    });
    const statuses = screen.getAllByRole('status');
    expect(statuses.length).toBeGreaterThanOrEqual(1);
  });
});
