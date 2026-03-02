import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useAtom } from 'jotai';
import { useMemo, type ReactNode } from 'react';

import { themeAtom } from '../../stores/theme-store';

import { createAppTheme } from './theme-config';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode] = useAtom(themeAtom);

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
