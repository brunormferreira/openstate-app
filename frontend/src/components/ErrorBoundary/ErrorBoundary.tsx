import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Title, Message, ReloadButton } from './ErrorBoundary.styles';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ readonly children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box role="alert">
        <Title>Something broke on our side</Title>
        <Message>The page hit an unexpected error. Reloading usually fixes it.</Message>
        <ReloadButton type="button" onClick={() => window.location.reload()}>
          Reload page
        </ReloadButton>
      </Box>
    );
  }
}
