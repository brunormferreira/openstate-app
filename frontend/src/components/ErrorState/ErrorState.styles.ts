import styled from 'styled-components';

export const Box = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.space(12)} ${theme.space(6)}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.danger};
`;

export const RetryButton = styled.button`
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
