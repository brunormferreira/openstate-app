import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { Footer } from './Footer';

function renderFooter() {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Footer />
    </ThemeProvider>,
  );
}

describe('Footer', () => {
  it('renders OpenStates credit', () => {
    renderFooter();
    expect(screen.getByText(/Data provided by/)).toBeInTheDocument();
  });

  it('renders API Docs link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'API Docs' })).toHaveAttribute(
      'href',
      'https://docs.openstates.org',
    );
  });

  it('renders GitHub link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/brunormferreira',
    );
  });
});
