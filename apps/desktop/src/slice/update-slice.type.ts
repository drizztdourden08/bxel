/* @layer renderer-app @kind types */
import type { Pivot2, Rect } from '@bxel/document';

interface SliceChange {
  name?: string;
  rect?: Rect;
  pivot?: Pivot2 | null;
  center?: Rect | null;
}

export type { SliceChange };
