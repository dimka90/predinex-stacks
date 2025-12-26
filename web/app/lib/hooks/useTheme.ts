import { useTheme as useThemeContext } from '@/app/context/ThemeContext';

export function useTheme() {
  return useThemeContext();
}
