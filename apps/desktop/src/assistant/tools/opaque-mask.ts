/* @layer renderer-app @kind logic */
import type { BufferView, MaskView } from '@bxel/raster';

const opaqueMask = (buffer: BufferView): MaskView => ({
  width: buffer.width,
  height: buffer.height,
  bits: Uint8Array.from(buffer.pixels, (value) => (value === 0 ? 0 : 1)),
});

export { opaqueMask };
