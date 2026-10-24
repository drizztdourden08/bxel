/* @layer root-config @kind config */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/*/tests/e2e/**/*.e2e.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 180000,
    hookTimeout: 180000,
    fileParallelism: false,
  },
});
