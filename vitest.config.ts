/* @layer root-config @kind config */
import { defineStandardsVitest } from '@drizztdourden08/standards/vitest';

export default defineStandardsVitest({
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['packages/*/tests/**/*.test.ts', 'apps/*/tests/**/*.test.ts'],
    passWithNoTests: true,
  },
  benchmark: {
    include: ['packages/*/tests/**/*.bench.ts', 'apps/*/tests/**/*.bench.ts'],
  },
});
