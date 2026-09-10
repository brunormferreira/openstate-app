import { Box, Title, Action } from './EmptyState.styles';

interface EmptyStateProps {
  readonly title: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box>
      <Title>{title}</Title>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <Action type="button" onClick={onAction}>
          {actionLabel}
        </Action>
      )}
    </Box>
  );
}
