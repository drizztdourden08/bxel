/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';

type Orientation = 'none' | 'horizontal' | 'vertical' | 'both';

type IdenticalMode = 'off' | 'same' | 'flips';

interface SpriteComparison {
  sameSize: boolean;
  identical: boolean;
  flippedAs: Exclude<Orientation, 'none'> | null;
  differing: number | null;
  total: number;
}

interface Twin {
  bytes: Uint8Array;
  ids: SpriteId[];
}

export type { IdenticalMode, Orientation, SpriteComparison, Twin };
