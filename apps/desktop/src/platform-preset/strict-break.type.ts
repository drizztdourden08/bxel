/* @layer renderer-app @kind types */
import type { Sprite } from '@bxel/document';

interface StrictGroup {
  platformId: string;
  sprites: readonly Sprite[];
  whole: boolean;
}

export type { StrictGroup };
