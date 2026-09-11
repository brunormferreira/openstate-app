import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SyncProvider, useSync } from './SyncContext';

function TestConsumer() {
  const { isSyncing, setSyncing } = useSync();
  return (
    <div>
      <span data-testid="syncing">{String(isSyncing)}</span>
      <button onClick={() => setSyncing(true)}>Start</button>
      <button onClick={() => setSyncing(false)}>Stop</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <SyncProvider>
      <TestConsumer />
    </SyncProvider>,
  );
}

describe('SyncContext', () => {
  it('provides default isSyncing as false', () => {
    renderProvider();
    expect(screen.getByTestId('syncing')).toHaveTextContent('false');
  });

  it('sets syncing to true', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByTestId('syncing')).toHaveTextContent('true');
  });

  it('sets syncing to false', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Stop' }));
    expect(screen.getByTestId('syncing')).toHaveTextContent('false');
  });
});
