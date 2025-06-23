import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/functions/v1'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.warn('Proxy error - Supabase services may not be running:', err.message);
          });
        }
      }
    }
  }
})