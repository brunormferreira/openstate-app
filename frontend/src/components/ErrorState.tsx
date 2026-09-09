import styled from 'styled-components';

const Box = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.space(12)} ${theme.space(6)}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.danger};
`;

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box role="alert">
      <Title>Something went wrong</Title>
      <p>{message}</p>
      {onRetry && (
        <RetryButton type="button" onClick={onRetry}>
          Try again
        </RetryButton>
      )}
    </Box>
  );
}
