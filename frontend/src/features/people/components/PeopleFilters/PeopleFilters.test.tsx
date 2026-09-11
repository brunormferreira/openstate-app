import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { PeopleFilterProvider } from '@/context/PeopleFilterContext';
import { PeopleFilters } from './PeopleFilters';

function renderFilters(
  props: Partial<React.ComponentProps<typeof PeopleFilters>> = {},
) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <PeopleFilterProvider>
        <PeopleFilters states={['GA', 'NC']} parties={['Dem', 'Rep']} {...props} />
      </PeopleFilterProvider>
    </ThemeProvider>,
  );
}

describe('PeopleFilters', () => {
  it('renders state and party selects', () => {
    renderFilters();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('Party')).toBeInTheDocument();
  });

  it('populates state options', () => {
    renderFilters();
    const select = screen.getByLabelText('State');
    expect(select).toHaveValue('');
    expect(screen.getByRole('option', { name: 'GA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'NC' })).toBeInTheDocument();
  });

  it('populates party options', () => {
    renderFilters();
    expect(screen.getByRole('option', { name: 'Dem' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rep' })).toBeInTheDocument();
  });

  it('shows loading text when isLoading', () => {
    renderFilters({ isLoading: true });
    const options = screen.getAllByRole('option', { name: 'Loading...' });
    expect(options.length).toBe(2);
  });

  it('shows clear button when filter is active', async () => {
    const user = userEvent.setup();
    renderFilters();
    await user.selectOptions(screen.getByLabelText('State'), 'GA');
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('does not show clear button when no filters active', () => {
    renderFilters();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderFilters();
    await user.selectOptions(screen.getByLabelText('State'), 'GA');
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByLabelText('State')).toHaveValue('');
  });

  it('disables selects when loading', () => {
    renderFilters({ isLoading: true });
    expect(screen.getByLabelText('State')).toBeDisabled();
    expect(screen.getByLabelText('Party')).toBeDisabled();
  });
});
