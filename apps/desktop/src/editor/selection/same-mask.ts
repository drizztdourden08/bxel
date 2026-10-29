/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';

const sameMask = (a: MaskView | null, b: MaskView | null): boolean => {
  if (a === null || b === null) return a === b;
  return a.width === b.width && a.height === b.height && a.bits.every((bit, at) => bit === b.bits[at]);
};

export { sameMask };
