import styled from 'styled-components';

const Box = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.space(12)} ${theme.space(6)}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.text};
`;

const Action = styled.button`
  margin-top: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

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
