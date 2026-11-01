/* @layer renderer-app @kind constants */
import type { LintRule } from '@bxel/raster';

const LINT_COLOURS: Readonly<Record<LintRule, string>> = {
  orphan: '#ff3b6b',
  double: '#ffb020',
  banding: '#3bb4ff',
};

const LINT_TEXT = {
  label: 'Pixel lint',
  description: 'Mark orphan pixels, doubles on one pixel lines and banding stripes. Red is an orphan, amber a double and blue banding. Nothing is changed.',
} as const;

export { LINT_COLOURS, LINT_TEXT };
