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
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
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
          manualChunks(id) {
            // React vendor chunk
            if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
              return 'react-vendor';
            }

            // Firebase chunk
            if (id.includes('node_modules/firebase') ||
              id.includes('node_modules/@firebase')) {
              return 'firebase';
            }

            // UI libraries chunk
            if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/@headlessui')) {
              return 'ui-vendor';
            }

            // GO-AIBOB specific chunk
            if (id.includes('src/pages/GoAibob')) {
              return 'goaibob';
            }
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000
    }
  };
});
