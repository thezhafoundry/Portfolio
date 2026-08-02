import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story/index.html'),
        results: resolve(__dirname, 'results/index.html'),
        schedule: resolve(__dirname, 'schedule/index.html'),
        terms: resolve(__dirname, 'policies/terms/index.html'),
        privacy: resolve(__dirname, 'policies/privacy/index.html'),
        refunds: resolve(__dirname, 'policies/refunds/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  test: {
    // Git worktrees under .worktrees/ carry their own copy of tests/, which
    // vitest would otherwise collect and run as duplicates of the real suite.
    exclude: ['**/node_modules/**', '**/dist/**', '.worktrees/**'],
  },
});
