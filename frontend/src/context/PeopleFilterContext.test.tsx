import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PeopleFilterProvider, usePeopleFilter } from './PeopleFilterContext';

function TestConsumer() {
  const { state, setStateFilter, setPartyFilter, setPage, setPerPage, clearFilters } =
    usePeopleFilter();
  return (
    <div>
      <span data-testid="state">{state.state}</span>
      <span data-testid="party">{state.party}</span>
      <span data-testid="page">{state.page}</span>
      <span data-testid="perPage">{state.perPage}</span>
      <button onClick={() => setStateFilter('GA')}>Set State</button>
      <button onClick={() => setPartyFilter('Dem')}>Set Party</button>
      <button onClick={() => setPage(3)}>Set Page</button>
      <button onClick={() => setPerPage(10)}>Set PerPage</button>
      <button onClick={clearFilters}>Clear</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <PeopleFilterProvider>
      <TestConsumer />
    </PeopleFilterProvider>,
  );
}

describe('PeopleFilterContext', () => {
  it('provides default values', () => {
    renderProvider();
    expect(screen.getByTestId('state')).toHaveTextContent('');
    expect(screen.getByTestId('party')).toHaveTextContent('');
    expect(screen.getByTestId('page')).toHaveTextContent('1');
    expect(screen.getByTestId('perPage')).toHaveTextContent('20');
  });

  it('sets state filter', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Set State' }));
    expect(screen.getByTestId('state')).toHaveTextContent('GA');
  });

  it('sets party filter', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Set Party' }));
    expect(screen.getByTestId('party')).toHaveTextContent('Dem');
  });

  it('sets page', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Set Page' }));
    expect(screen.getByTestId('page')).toHaveTextContent('3');
  });

  it('sets perPage', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Set PerPage' }));
    expect(screen.getByTestId('perPage')).toHaveTextContent('10');
  });

  it('clears all filters', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Set State' }));
    await user.click(screen.getByRole('button', { name: 'Set Party' }));
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByTestId('state')).toHaveTextContent('');
    expect(screen.getByTestId('party')).toHaveTextContent('');
  });
});
