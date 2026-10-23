/* @layer tests @kind logic */
import type { BufferView } from '@bxel/raster';

const blankBuffer = (width: number, height: number): BufferView => ({
  pixels: new Uint8Array(width * height),
  width,
  height,
});

export { blankBuffer };
