/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';

const opaqueOf = (pixels: Uint8Array, width: number, height: number): MaskView => ({
  width,
  height,
  bits: Uint8Array.from(pixels, (value) => (value === 0 ? 0 : 1)),
});

export { opaqueOf };
