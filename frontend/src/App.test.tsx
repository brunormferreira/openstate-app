import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeModeProvider } from '@/context/ThemeContext';
import { PeopleFilterProvider } from '@/context/PeopleFilterContext';
import { SyncProvider } from '@/context/SyncContext';
import App from './App';

vi.mock('@/features/people/components/PeopleList/PeopleList', () => ({
  PeopleList: () => <div data-testid="people-list" />,
}));

vi.mock('@/components/ThemeToggle/ThemeToggle', () => ({
  ThemeToggle: () => <button>Toggle</button>,
}));

vi.mock('@/components/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <PeopleFilterProvider>
          <SyncProvider>
            <App />
          </SyncProvider>
        </PeopleFilterProvider>
      </ThemeModeProvider>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renders the title', () => {
    renderApp();
    expect(screen.getByText('US Politicians')).toBeInTheDocument();
  });

  it('renders the people list', () => {
    renderApp();
    expect(screen.getByTestId('people-list')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderApp();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
