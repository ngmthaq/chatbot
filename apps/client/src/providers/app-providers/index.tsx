import { CircularProgress, Box } from '@mui/material';
import { Provider as JotaiProvider } from 'jotai';
import { lazy, Suspense, type ReactNode } from 'react';
import { Toaster } from 'sonner';

import QueryProvider from '../query-provider';
import ThemeProvider from '../theme-provider';

// Dynamically import DevTools only in development to enable proper tree-shaking
const DevTools = import.meta.env.DEV
  ? lazy(() =>
      import('jotai-devtools').then((module) => ({
        default: module.DevTools,
      })),
    )
  : null;

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
            {import.meta.env.DEV && DevTools && (
              <Suspense fallback={null}>
                <DevTools />
              </Suspense>
            )}
          </ThemeProvider>
        </JotaiProvider>
      </QueryProvider>
    </Suspense>
  );
}
