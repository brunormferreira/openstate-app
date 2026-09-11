import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { FullScreenLoader } from './FullScreenLoader';

function renderLoader() {
  return render(
    <ThemeProvider theme={lightTheme}>
      <FullScreenLoader />
    </ThemeProvider>,
  );
}

describe('FullScreenLoader', () => {
  it('renders an element with aria-live polite', () => {
    renderLoader();
    const status = screen.getAllByRole('status');
    const overlay = status.find((el) => el.getAttribute('aria-live') === 'polite');
    expect(overlay).toBeDefined();
  });

  it('renders a spinner inside', () => {
    renderLoader();
    expect(screen.getAllByRole('status').length).toBeGreaterThanOrEqual(2);
  });
});
