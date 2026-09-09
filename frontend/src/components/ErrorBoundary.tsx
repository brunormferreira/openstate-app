import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  max-width: 480px;
  margin: 96px auto;
  padding: ${({ theme }) => theme.space(8)};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.text};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.space(5)};
`;

const ReloadButton = styled.button`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(5)}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

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
