import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import AppLayout from '../../layouts/app-layout';
import { getTokens } from '../../utils/token-manager';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const tokens = getTokens();

    if (!tokens.accessToken) {
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
