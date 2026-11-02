/* @layer renderer-app @kind constants */
import type { QuickKind } from './quick-palette.type';

const QUICK_KINDS: readonly QuickKind[] = ['tool', 'recent', 'preset'];

const QUICK_TEXT = {
  region: 'Quick palette',
  recent: 'Recent',
  presets: 'Presets',
} as const;

const QUICK_TAP_MS = 250;

const QUICK_CELL_SELECTOR = `[role="listbox"][aria-label="${QUICK_TEXT.region}"] [data-choice-index]`;

export { QUICK_CELL_SELECTOR, QUICK_KINDS, QUICK_TAP_MS, QUICK_TEXT };
