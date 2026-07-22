import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story/index.html'),
        // results: resolve(__dirname, 'results/index.html'),
        // schedule: resolve(__dirname, 'schedule/index.html'),
      },
    },
  },
});
