import { RouterProvider, createRouter } from '@tanstack/react-router';

import AppProviders from './providers/app-providers';
import { routeTree } from './routeTree.gen';

// Create router instance
const router = createRouter({ routeTree });

// Register types for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
