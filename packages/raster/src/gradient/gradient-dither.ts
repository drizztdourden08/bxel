/* @layer core @kind logic */
import { bayerMatrix } from './bayer-matrix';
import type { GradientDither } from './gradient-dither.type';
import type { GradientOptions } from './gradient.type';
import { seamlessSide } from './seamless-side';

const gradientDither = ({ bayer, target, wrap, pattern }: GradientOptions): GradientDither | null => {
  if (bayer === null) return null;
  const style = pattern ?? 'bayer';
  const side = seamlessSide(bayer, target, wrap ?? {});
  if (style === 'bayer' && side === 1) return null;
  return { style, grid: { matrix: side === 1 ? new Uint8Array(1) : bayerMatrix(side), side } };
};

export { gradientDither };
