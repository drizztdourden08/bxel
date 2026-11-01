/* @layer root-config @kind config */
import { defineStandardsVitest } from '@drizztdourden08/standards/vitest';

export default defineStandardsVitest({
  test: {
    include: ['apps/*/tests/e2e/**/*.e2e.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    hookTimeout: 180000,
    fileParallelism: false,
    globalSetup: ['apps/desktop/tests/e2e/global-setup.ts'],
    setupFiles: ['apps/desktop/tests/e2e/setup-owned.ts'],
  },
});
