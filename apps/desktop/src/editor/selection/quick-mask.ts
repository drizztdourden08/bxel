/* @layer renderer-app @kind logic */
import type { MaskView, Size } from '@bxel/raster';
import { mergeMask } from './merge-mask';

const quickMaskResult = (base: MaskView | null, scratch: Uint8Array, size: Size, erase: boolean): MaskView => {
  const painted: MaskView = { bits: scratch.slice(), width: size.width, height: size.height };
  return mergeMask(base, painted, erase ? 'subtract' : 'add') ?? { bits: new Uint8Array(size.width * size.height), width: size.width, height: size.height };
};

export { quickMaskResult };
