import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { EmptyState } from './EmptyState';

function renderEmptyState(props: Partial<React.ComponentProps<typeof EmptyState>> = {}) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <EmptyState title="Nothing here" {...props} />
    </ThemeProvider>,
  );
}

describe('EmptyState', () => {
  it('renders the title', () => {
    renderEmptyState();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders the message when provided', () => {
    renderEmptyState({ message: 'No results' });
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('does not render a button when actionLabel is absent', () => {
    renderEmptyState();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the action button when actionLabel and onAction are provided', async () => {
    const onAction = vi.fn();
    renderEmptyState({ actionLabel: 'Refresh', onAction });
    const btn = screen.getByRole('button', { name: 'Refresh' });
    await userEvent.click(btn);
    expect(onAction).toHaveBeenCalledOnce();
  });
});
