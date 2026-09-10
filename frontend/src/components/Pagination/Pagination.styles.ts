import styled from 'styled-components';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  margin-top: ${({ theme }) => theme.space(8)};
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 ${({ theme }) => theme.space(2)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryContrast : theme.colors.textMuted)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: ${({ theme }) => `background ${theme.transition}, border-color ${theme.transition}`};

  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.surfaceHover};
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.borderStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const Gap = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin: 0 ${({ theme }) => theme.space(2)};
`;
