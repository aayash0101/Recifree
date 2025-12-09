import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/favorites/api': 'http://localhost:3000',
      '/recipes': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/ingredients': 'http://localhost:3000',
    },
  },
});
