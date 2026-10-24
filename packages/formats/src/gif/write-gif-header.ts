/* @layer core @kind logic */
import type { GifAnimation } from '../animation/animation.type';
import { byteAt } from '../pixels/byte-at';
import { GIF_BLOCK } from './gif-block.constants';
import { GIF_SIGNATURE } from './gif-signature.constants';
import { writeU16Le } from './write-u16-le';

const writeGifHeader = (animation: GifAnimation, bits: number): Uint8Array => {
  const entries = animation.palette.length / 4;
  const { HEADER_LENGTH, SCREEN_LENGTH, TABLE_FLAG } = GIF_BLOCK;
  const tableStart = HEADER_LENGTH + SCREEN_LENGTH;
  const out = new Uint8Array(tableStart + (1 << bits) * 3);
  out.set(GIF_SIGNATURE, 0);
  writeU16Le(out, HEADER_LENGTH, animation.width);
  writeU16Le(out, HEADER_LENGTH + 2, animation.height);
  out[HEADER_LENGTH + 4] = TABLE_FLAG | ((bits - 1) << 4) | (bits - 1);
  for (let i = 0; i < entries; i += 1) {
    for (let c = 0; c < 3; c += 1) out[tableStart + i * 3 + c] = byteAt(animation.palette, i * 4 + c);
  }
  return out;
};

export { writeGifHeader };
