import { Box, Title, RetryButton } from './ErrorState.styles';

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
