import path from 'path';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    envDir: path.resolve(__dirname, '../../'),
    envPrefix: 'VITE_',
    server: {
      port: parseInt(process.env.VITE_APP_PORT || '5173', 10),
    },
    preview: {
      port: parseInt(process.env.VITE_APP_PORT || '5173', 10),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
