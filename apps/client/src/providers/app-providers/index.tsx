import { CircularProgress, Box } from '@mui/material';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { Suspense, type ReactNode } from 'react';
import { Toaster } from 'sonner';

import QueryProvider from '../query-provider';
import ThemeProvider from '../theme-provider';

interface AppProvidersProps {
  children: ReactNode;
}

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QueryProvider>
        <JotaiProvider>
          <ThemeProvider>
            {children}
            <Toaster
              richColors
              position="top-right"
              expand={false}
              closeButton
            />
            {import.meta.env.DEV && <DevTools />}
          </ThemeProvider>
        </JotaiProvider>
      </QueryProvider>
    </Suspense>
  );
}
