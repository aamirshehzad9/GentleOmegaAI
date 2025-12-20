import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: true,
      strictPort: false,
    },
    plugins: [react()],
    define: {
      // Removed manual process.env definitions to prevent build-time replacement errors
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Make sure all VITE_ prefixed env vars are available
    envPrefix: 'VITE_',

    // Build optimization
    build: {
      rollupOptions: {
        output: {
          // manualChunks configuration removed to fix React loading issues
          // manualChunks: undefined
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000
    }
  };
});
