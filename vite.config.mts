import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement définies dans Azure SWA
  const env = loadEnv(mode, process.cwd(), '');

  // Variables importantes
  const API_URL = env.VITE_APP_API_URL || 'http://localhost:80';
  const BASE_NAME = env.VITE_APP_BASE_NAME || '/';
  const MERCURE_URL = env.VITE_APP_MERCURE_URL || `${API_URL}/.well-known/mercure`;
  const APP_VERSION = env.VITE_APP_VERSION || 'v9.2.0';
  const PORT = 3000;

  return {
    base: BASE_NAME,
    server: {
      open: true,
      port: PORT,
      host: true,
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
      }
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window',
      'process.env': {
        VITE_APP_API_URL: API_URL,
        VITE_APP_BASE_NAME: BASE_NAME,
        VITE_APP_MERCURE_URL: MERCURE_URL,
        VITE_APP_VERSION: APP_VERSION
      }
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: 'assets', replacement: path.resolve(__dirname, 'src/assets') }
      ]
    },
    plugins: [react(), viteTsconfigPaths()]
  };
});
