/* @layer core @kind logic */
import type { GifAnimation, IndexedFrame } from '../animation/animation.type';
import { concatBytes } from '../concat-bytes';
import { encodeLzw } from './encode-lzw';
import { GIF_BLOCK } from './gif-block.constants';
import { GIF_DISPOSAL } from './gif-disposal.constants';
import { gifDelayCs } from './gif-delay';
import { GIF_LIMITS } from './gif-limits.constants';
import { packSubBlocks } from './pack-sub-blocks';
import { writeU16Le } from './write-u16-le';

const writeControl = (frame: IndexedFrame, transparentIndex: number | null): Uint8Array => {
  const transparent = transparentIndex !== null;
  const disposal = transparent ? GIF_DISPOSAL.BACKGROUND : GIF_DISPOSAL.KEEP;
  const out = new Uint8Array(8);
  out[0] = GIF_BLOCK.EXTENSION;
  out[1] = GIF_BLOCK.GRAPHIC_CONTROL;
  out[2] = 4;
  out[3] = (disposal << 2) | (transparent ? GIF_BLOCK.TRANSPARENT_FLAG : 0);
  writeU16Le(out, 4, gifDelayCs(frame.delayMs));
  out[6] = transparentIndex ?? 0;
  return out;
};

const writeDescriptor = (width: number, height: number): Uint8Array => {
  const out = new Uint8Array(10);
  out[0] = GIF_BLOCK.IMAGE;
  writeU16Le(out, 5, width);
  writeU16Le(out, 7, height);
  return out;
};

const writeGifFrame = (
  animation: GifAnimation,
  frame: IndexedFrame,
  bits: number,
): Uint8Array => {
  const minCodeSize = Math.max(GIF_LIMITS.MIN_CODE_SIZE, bits);
  return concatBytes([
    writeControl(frame, animation.transparentIndex),
    writeDescriptor(animation.width, animation.height),
    Uint8Array.of(minCodeSize),
    packSubBlocks(encodeLzw(frame.indices, minCodeSize)),
  ]);
};

export { writeGifFrame };
