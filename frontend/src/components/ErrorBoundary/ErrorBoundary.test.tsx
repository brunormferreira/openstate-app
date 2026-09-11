import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { ErrorBoundary } from './ErrorBoundary';

function ProblemChild() {
  throw Object.assign(new Error('Test error'), { _suppressLogging: true });
  return null;
}

function renderBoundary(ui = <ProblemChild />) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ErrorBoundary>{ui}</ErrorBoundary>
    </ThemeProvider>,
  );
}

describe('ErrorBoundary', () => {
  const errorHandlers = new Set<() => void>();

  function silenceUncaughtErrors() {
    const handler = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', handler);
    const stop = () => window.removeEventListener('error', handler);
    errorHandlers.add(stop);
    return stop;
  }

  afterEach(() => {
    for (const stop of errorHandlers) stop();
    errorHandlers.clear();
  });

  it('renders children when no error', () => {
    renderBoundary(<span>Safe content</span>);
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    const viSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const stop = silenceUncaughtErrors();
    renderBoundary();
    expect(screen.getByText('Something broke on our side')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    stop();
    viSpy.mockRestore();
  });

  it('renders reload button', () => {
    const viSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const stop = silenceUncaughtErrors();
    renderBoundary();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    stop();
    viSpy.mockRestore();
  });
});
