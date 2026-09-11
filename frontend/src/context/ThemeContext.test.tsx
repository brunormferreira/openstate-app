import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeModeProvider, useThemeMode } from './ThemeContext';

function TestConsumer() {
  const { mode, toggleMode } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleMode}>Toggle</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <ThemeModeProvider>
      <TestConsumer />
    </ThemeModeProvider>,
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides a default mode', () => {
    renderProvider();
    const mode = screen.getByTestId('mode').textContent;
    expect(mode === 'light' || mode === 'dark').toBe(true);
  });

  it('toggles mode', async () => {
    const user = userEvent.setup();
    renderProvider();
    const initial = screen.getByTestId('mode').textContent;
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    const next = screen.getByTestId('mode').textContent;
    expect(next).not.toBe(initial);
  });

  it('persists mode to localStorage', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    const stored = localStorage.getItem('openstates:theme-mode');
    expect(stored === 'light' || stored === 'dark').toBe(true);
  });
});
