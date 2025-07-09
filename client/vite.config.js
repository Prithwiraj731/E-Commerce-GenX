import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
      '/product': 'http://localhost:5000',
      '/cart': 'http://localhost:5000',
      '/order': 'http://localhost:5000',
    },
    allowedHosts: ['b3dcc04ca3c5.ngrok-free.app'],
  }
});
