/* @layer renderer-app @kind types */
import type { Clip } from './selection.type';

interface CarriedClip {
  clip: Clip;
  table: Uint8Array;
}

export type { CarriedClip };
