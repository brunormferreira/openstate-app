import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/Toast';
import { PeopleFilterProvider } from '@/context/PeopleFilterProvider';
import { ThemeModeProvider } from '@/context/ThemeModeProvider';
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
          <ToastProvider>
            <PeopleFilterProvider>
              <App />
            </PeopleFilterProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeModeProvider>
  </StrictMode>,
);
