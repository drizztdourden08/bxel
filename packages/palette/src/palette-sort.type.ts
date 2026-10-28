/* @layer core @kind types */
import type { PaletteBank, Swatch } from '@bxel/document';

type PaletteSortKey = 'lightness' | 'luminance' | 'hue' | 'chroma' | 'name' | 'use' | 'ramp';

type PaletteSortDirection = 'ascending' | 'descending';

interface PaletteSortRequest {
  readonly key: PaletteSortKey;
  readonly direction: PaletteSortDirection;
  readonly swatches?: readonly string[];
  readonly usage: ArrayLike<number>;
}

type ColourSwatch = Extract<Swatch, { kind: 'color' }>;

interface SortInput {
  readonly bank: PaletteBank;
  readonly swatch: ColourSwatch;
  readonly index: number;
  readonly usage: ArrayLike<number>;
}

export type { ColourSwatch, PaletteSortDirection, PaletteSortKey, PaletteSortRequest, SortInput };
