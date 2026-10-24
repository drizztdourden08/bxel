/* @layer renderer-app @kind types */
import type { AreaClash } from '@bxel/presets';

interface FrameClash {
  frameId: string;
  frame: number;
  clash: AreaClash;
}

export type { FrameClash };
