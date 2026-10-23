/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { PaletteSlot } from './palette-slots.type';

interface StatusInput {
  pointer: Point | null;
  zoom: number;
  colour: PaletteSlot | null;
  clean: boolean;
}

export type { StatusInput };
