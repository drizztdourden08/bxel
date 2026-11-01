/* @layer renderer-app @kind logic */
import { wandMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { mergeMask } from './merge-mask';
import type { QuickFill } from './quick-mask-fill.type';

const quickMaskFill = ({ base, size, seed, erase, connectivity }: QuickFill): MaskView => {
  const bits = base ? base.bits : new Uint8Array(size.width * size.height);
  const region = wandMask({ target: { pixels: bits, width: size.width, height: size.height }, seed, connectivity });
  return mergeMask(base, region, erase ? 'subtract' : 'add') ?? { bits: new Uint8Array(size.width * size.height), width: size.width, height: size.height };
};

export { quickMaskFill };
