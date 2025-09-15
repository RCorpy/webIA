import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
