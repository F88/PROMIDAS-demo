/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/PROMIDAS-demo/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/material') || id.includes('@mui/system')) {
              return 'mui-core';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('promidas-utils')) {
              return 'promidas-utils';
            }
            if (id.includes('promidas')) {
              return 'promidas';
            }
            if (id.includes('protopedia-api-v2-client')) {
              return 'protopedia-api-v2-client';
            }
          }
        },
      },
    },
  },
});
