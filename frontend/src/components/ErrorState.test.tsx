import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { ErrorState } from './ErrorState';

function renderErrorState(props: Partial<React.ComponentProps<typeof ErrorState>> = {}) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ErrorState message="Oops" {...props} />
    </ThemeProvider>,
  );
}

describe('ErrorState', () => {
  it('renders the message within an alert role', () => {
    renderErrorState();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Oops');
  });

  it('renders retry button when onRetry is provided', () => {
    renderErrorState({ onRetry: vi.fn() });
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('does not render retry button without onRetry', () => {
    renderErrorState();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRetry when button is clicked', async () => {
    const onRetry = vi.fn();
    renderErrorState({ onRetry });
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
