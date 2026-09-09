import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { Pagination } from './Pagination';

function renderPagination(
  props: Partial<React.ComponentProps<typeof Pagination>> = {},
) {
  const onPageChange = vi.fn();
  return {
    onPageChange,
    ...render(
      <ThemeProvider theme={lightTheme}>
        <Pagination page={1} totalPages={5} onPageChange={onPageChange} {...props} />
      </ThemeProvider>,
    ),
  };
}

describe('Pagination', () => {
  it('returns null when totalPages <= 1', () => {
    const { container } = renderPagination({ totalPages: 1 });
    expect(container.innerHTML).toBe('');
  });

  it('renders page buttons for each page when totalPages <= 7', () => {
    renderPagination({ page: 1, totalPages: 5 });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('calls onPageChange when a page button is clicked', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 1, totalPages: 5 });
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with page - 1 for Previous', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, totalPages: 5 });
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page + 1 for Next', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, totalPages: 5 });
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables Previous when on page 1', () => {
    renderPagination({ page: 1, totalPages: 5 });
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables Next when on last page', () => {
    renderPagination({ page: 5, totalPages: 5 });
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('shows gap ellipsis when totalPages > 7 and current page is far from edges', () => {
    renderPagination({ page: 5, totalPages: 20 });
    const gaps = screen.getAllByText('...');
    expect(gaps.length).toBeGreaterThanOrEqual(1);
  });

  it('renders aria-current on the active page', () => {
    renderPagination({ page: 2, totalPages: 5 });
    const active = screen.getByRole('button', { name: '2' });
    expect(active).toHaveAttribute('aria-current', 'page');
  });
});
