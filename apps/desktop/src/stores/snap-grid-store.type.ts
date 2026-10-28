/* @layer renderer-app @kind types */
import type { Size } from '@bxel/document';

interface SnapGridState {
  grid: Size | null;
  set: (grid: Size | null) => void;
}

export type { SnapGridState };
