import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { PeopleFilterProvider } from '@/context/PeopleFilterContext';
import { ThemeModeProvider } from '@/context/ThemeContext';
import GlobalStyle from '@/styles/global';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <GlobalStyle />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PeopleFilterProvider>
            <App />
          </PeopleFilterProvider>
        </QueryClientProvider>
      </ErrorBoundary>
      <Toaster position="top-right" richColors />
    </ThemeModeProvider>
  </StrictMode>,
);
