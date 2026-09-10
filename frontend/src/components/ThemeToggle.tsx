import styled from 'styled-components';
import { useThemeMode } from '@/context/ThemeContext';

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => `background ${theme.transition}, border-color ${theme.transition}`};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Icon = styled.span`
  font-size: 15px;
  line-height: 1;
`;

const Label = styled.span`
  display: none;

  @media (min-width: 480px) {
    display: inline;
  }
`;

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <Toggle type="button" onClick={toggleMode} aria-label={`Switch to ${nextMode} theme`}>
      <Icon aria-hidden="true">{mode === 'light' ? '\u{1F319}' : '\u2600\uFE0F'}</Icon>
      <Label>{mode === 'light' ? 'Dark' : 'Light'}</Label>
    </Toggle>
  );
}
