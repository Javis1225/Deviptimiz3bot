import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Vitest reads its config from this same file (the `test` key below) —
// no separate vitest.config.ts needed.
export default defineConfig({
  plugins: [react()],
  server: {
    // Telegram Mini Apps must be served over HTTPS, so local development
    // usually goes through a tunnel (ngrok, Cloudflare Tunnel, etc.).
    // host:true lets that tunnel reach this dev server.
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
