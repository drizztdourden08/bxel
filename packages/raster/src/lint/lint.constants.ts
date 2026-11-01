/* @layer core @kind constants */
import type { LintRule } from './lint.type';

const LINT_RULES: readonly LintRule[] = ['orphan', 'double', 'banding'];

const LINT_LIMIT = 500;

const BAND_MIN = { run: 3, rows: 3 } as const;

export { BAND_MIN, LINT_LIMIT, LINT_RULES };
