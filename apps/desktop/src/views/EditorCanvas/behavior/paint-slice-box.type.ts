/* @layer renderer-app @kind types */
import type { Slice } from '@bxel/document';
import type { OverlayLook } from './canvas-tools.type';

interface SliceBoxLook {
  slice: Slice;
  selected: boolean;
  look: OverlayLook;
}

export type { SliceBoxLook };
