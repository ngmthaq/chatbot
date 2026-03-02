import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

import ErrorBoundary from '../components/error-boundary';

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  ),
});
