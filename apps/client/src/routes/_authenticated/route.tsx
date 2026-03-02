import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import AppLayout from '../../layouts/app-layout';
import { getAccessToken } from '../../utils/token-manager';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const accessToken = getAccessToken();

    // No access token - redirect to login
    // Token refresh will be handled by API client interceptor on 401 errors
    if (!accessToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Authenticated,
});

function Authenticated() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
