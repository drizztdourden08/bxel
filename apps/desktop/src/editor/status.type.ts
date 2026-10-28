/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { StatusExtras } from '../status-extras/status-extras.type';
import type { BxelContext } from '../ui-context/bxel-context.type';
import type { PaletteSlot } from './palette-slots.type';

interface StatusInput {
  pointer: Point | null;
  zoom: number;
  colours: readonly [PaletteSlot | null, PaletteSlot | null];
  clean: boolean;
  recovered: boolean;
  context: BxelContext;
  tile: number | null;
  extras?: StatusExtras;
}

export type { StatusInput };
