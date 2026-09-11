import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { ThemeModeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

function renderToggle() {
  return render(
    <ThemeModeProvider>
      <ThemeProvider theme={lightTheme}>
        <ThemeToggle />
      </ThemeProvider>
    </ThemeModeProvider>,
  );
}

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    renderToggle();
    expect(screen.getByRole('button', { name: /Switch to/ })).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    renderToggle();
    const btn = screen.getByRole('button', { name: /Switch to/ });
    const initialLabel = btn.getAttribute('aria-label');
    await user.click(btn);
    const nextLabel = btn.getAttribute('aria-label');
    expect(nextLabel).toBeTruthy();
    expect(nextLabel).not.toBe(initialLabel);
  });
});
