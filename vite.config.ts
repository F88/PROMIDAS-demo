/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/PROMIDAS-demo/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@mui/system'],
          'mui-icons': ['@mui/icons-material'],
        },
      },
    },
  },
});
