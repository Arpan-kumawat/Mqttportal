import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // load environment variables to allow using VITE_PROXY_TARGET in .env files
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:3000';

  return defineConfig({
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // dev server proxy: forward API and websocket requests to backend
    server: {
      proxy: {
        // proxy /api/* to the backend (strip /api prefix)
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          // preserve the /api prefix when proxying so backend receives /api/...
          // if you want to remove the prefix, re-add a rewrite function here
        },
        // example websocket proxy (adjust path if you use a different socket path)
        '/socket': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
