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
  const onPerPageChange = vi.fn();
  return {
    onPageChange,
    onPerPageChange,
    ...render(
      <ThemeProvider theme={lightTheme}>
        <Pagination
          page={1}
          totalItems={100}
          perPage={20}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          {...props}
        />
      </ThemeProvider>,
    ),
  };
}

describe('Pagination', () => {
  it('shows the range text', () => {
    renderPagination({ page: 2, totalItems: 55, perPage: 20 });
    expect(screen.getByText('21 – 40 of 55')).toBeInTheDocument();
  });

  it('shows "0 results" when totalItems is 0', () => {
    renderPagination({ totalItems: 0 });
    expect(screen.getByText('0 results')).toBeInTheDocument();
  });

  it('calls onPageChange with page - 1 for Previous', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, totalItems: 100 });
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page + 1 for Next', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, totalItems: 100 });
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables Previous when on page 1', () => {
    renderPagination({ page: 1, totalItems: 100 });
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables Next when on last page', () => {
    renderPagination({ page: 5, totalItems: 100, perPage: 20 });
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('displays the per-page selector with the correct value', () => {
    renderPagination({ perPage: 15 });
    expect(screen.getByRole('combobox', { name: 'Items per page' })).toHaveValue('15');
  });

  it('calls onPerPageChange when the per-page selector changes', async () => {
    const user = userEvent.setup();
    const { onPerPageChange } = renderPagination();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Items per page' }), '10');
    expect(onPerPageChange).toHaveBeenCalledWith(10);
  });
});