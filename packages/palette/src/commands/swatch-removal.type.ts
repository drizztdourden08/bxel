/* @layer core @kind types */
import type { PaletteBank, SwatchId } from '@bxel/document';

type SwatchRemoval = {
  readonly bank: PaletteBank;
  readonly removed: number;
  readonly replacement: number;
  readonly substitute: SwatchId | null;
};

export type { SwatchRemoval };
