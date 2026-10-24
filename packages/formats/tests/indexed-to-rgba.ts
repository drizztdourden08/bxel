/* @layer tests @kind helper */
import type { PixelBytes } from '@bxel/formats';

const indexedToRgba = (
  indices: PixelBytes,
  palette: PixelBytes,
  transparentIndex: number | null,
): number[] =>
  Array.from(indices).flatMap((index) =>
    index === transparentIndex ? [0, 0, 0, 0] : Array.from(palette.subarray(index * 4, index * 4 + 4)),
  );

export { indexedToRgba };
