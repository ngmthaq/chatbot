import { createFileRoute, Outlet } from '@tanstack/react-router';

import ProtectedRoute from '../components/protected-route';
import AppLayout from '../layouts/app-layout';

export const Route = createFileRoute('/_authenticated')({
  component: Authenticated,
});

function Authenticated() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}
