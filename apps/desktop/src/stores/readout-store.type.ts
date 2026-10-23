/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

interface ReadoutState {
  pointer: Point | null;
  zoom: number;
  setPointer: (pointer: Point | null) => void;
  setZoom: (zoom: number) => void;
}

export type { ReadoutState };
