/* @layer renderer-app @kind types */
import type { AnimFrameId } from '@bxel/document';

interface Clock {
  elapsed: number;
  last: number | null;
  shown: AnimFrameId | null;
}

export type { Clock };
