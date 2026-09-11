import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { Spinner } from './Spinner';

function renderSpinner() {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Spinner />
    </ThemeProvider>,
  );
}

describe('Spinner', () => {
  it('renders with aria-label', () => {
    renderSpinner();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });
});
