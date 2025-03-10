import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://memories-project-part4.herokuapp.com/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
