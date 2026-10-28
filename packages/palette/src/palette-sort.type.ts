/* @layer core @kind types */
type PaletteSortKey = 'lightness' | 'luminance' | 'hue' | 'chroma' | 'name' | 'use' | 'ramp';

type PaletteSortDirection = 'ascending' | 'descending';

interface PaletteSortRequest {
  readonly key: PaletteSortKey;
  readonly direction: PaletteSortDirection;
  readonly swatches?: readonly string[];
  readonly usage: ArrayLike<number>;
}

export type { PaletteSortDirection, PaletteSortKey, PaletteSortRequest };
