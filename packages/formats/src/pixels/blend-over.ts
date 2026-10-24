/* @layer core @kind logic */
import { BLEND } from './blend.constants';
import { byteAt } from './byte-at';

const blendOver = (
  dst: Uint8ClampedArray,
  at: number,
  src: ArrayLike<number>,
  from: number,
): void => {
  const srcAlpha = byteAt(src, from + 3);
  if (srcAlpha === 0) return;
  const dstAlpha = byteAt(dst, at + 3);
  if (srcAlpha === BLEND.OPAQUE || dstAlpha === 0) {
    for (let c = 0; c < BLEND.CHANNELS; c += 1) dst[at + c] = byteAt(src, from + c);
    return;
  }
  const keep = (dstAlpha * (BLEND.OPAQUE - srcAlpha)) / BLEND.OPAQUE;
  const outAlpha = srcAlpha + keep;
  for (let c = 0; c < 3; c += 1) {
    const mixed = byteAt(src, from + c) * srcAlpha + byteAt(dst, at + c) * keep;
    dst[at + c] = Math.round(mixed / outAlpha);
  }
  dst[at + 3] = Math.round(outAlpha);
};

export { blendOver };
