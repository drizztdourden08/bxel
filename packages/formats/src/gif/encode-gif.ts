/* @layer core @kind logic */
import type { GifAnimation } from '../animation/animation.type';
import type { FormatBytesResult } from '../failure/format.type';
import { concatBytes } from '../concat-bytes';
import { checkGifAnimation } from './check-gif-animation';
import { GIF_BLOCK } from './gif-block.constants';
import { gifPaletteBits } from './gif-palette-bits';
import { writeGifFrame } from './write-gif-frame';
import { writeGifHeader } from './write-gif-header';
import { writeGifLoop } from './write-gif-loop';

const encodeGif = (animation: GifAnimation): FormatBytesResult => {
  const invalid = checkGifAnimation(animation);
  if (invalid) return invalid;
  const bits = gifPaletteBits(animation.palette.length / 4);
  const bytes = concatBytes([
    writeGifHeader(animation, bits),
    writeGifLoop(animation.loops),
    ...animation.frames.map((frame) => writeGifFrame(animation, frame, bits)),
    Uint8Array.of(GIF_BLOCK.TRAILER),
  ]);
  return { ok: true, bytes };
};

export { encodeGif };
