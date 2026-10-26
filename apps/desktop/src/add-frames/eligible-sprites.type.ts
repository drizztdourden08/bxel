/* @layer renderer-app @kind types */
import type { Sprite } from '@bxel/document';

interface Eligible {
  sprites: readonly Sprite[];
  other: number;
}

export type { Eligible };
