/* @layer renderer-app @kind constants */
import type { QuickKind } from './quick-palette.type';

const QUICK_KINDS: readonly QuickKind[] = ['tool', 'recent', 'preset'];

const QUICK_TEXT = {
  region: 'Quick palette',
  recent: 'Recent',
  presets: 'Presets',
} as const;

export { QUICK_KINDS, QUICK_TEXT };
