/* @layer renderer-app @kind types */
import type { SavedBrush, SavedPattern } from '@bxel/document';

type SavedLibrary = {
  readonly brushes: readonly SavedBrush[];
  readonly patterns: readonly SavedPattern[];
};

export type { SavedLibrary };
