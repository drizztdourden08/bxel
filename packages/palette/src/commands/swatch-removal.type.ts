/* @layer core @kind types */
import type { PaletteBank, SwatchId } from '@bxel/document';

type SwatchRemoval = {
  readonly bank: PaletteBank;
  readonly removed: number;
  readonly replacement: number;
  readonly substitute: SwatchId | null;
};

type SwatchFold = {
  readonly from: SwatchId;
  readonly into: SwatchId | null;
};

export type { SwatchFold, SwatchRemoval };
