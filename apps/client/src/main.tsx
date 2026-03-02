import 'regenerator-runtime/runtime'; // Polyfill for react-speech-recognition
import 'jotai-devtools/styles.css'; // Jotai DevTools styles
import './utils/i18n'; // Initialize i18n
import './assets/css/index.css'; // Global styles

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
