import { useThemeMode } from '@/context/ThemeContext';
import { Toggle, Icon, Label } from './ThemeToggle.styles';

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