/* @layer root-config @kind config */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/tests/**/*.test.ts', 'apps/*/tests/**/*.test.ts'],
    passWithNoTests: true,
  },
  benchmark: {
    include: ['packages/*/tests/**/*.bench.ts', 'apps/*/tests/**/*.bench.ts'],
  },
});
