import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import AuthLayout from '../../layouts/auth-layout';
import { getAccessToken } from '../../utils/token-manager';

export const Route = createFileRoute('/_guest')({
  beforeLoad: async () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      throw redirect({ to: '/chat' });
    }
  },
  component: Guest,
});

function Guest() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
