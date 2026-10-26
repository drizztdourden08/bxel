/* @layer core @kind logic */
import type { GifAnimation } from '../animation/animation.type';
import type { FormatBytesResult } from '../failure/format.type';
import { concatBytes } from '../concat-bytes';
import { checkGifAnimation } from './check-gif-animation';
import { GIF_BLOCK } from './gif-block.constants';
import { foldGifAlpha } from './fold-gif-alpha';
import { gifPaletteBits } from './gif-palette-bits';
import { writeGifFrame } from './write-gif-frame';
import { writeGifHeader } from './write-gif-header';
import { writeGifLoop } from './write-gif-loop';

const encodeGif = (source: GifAnimation): FormatBytesResult => {
  const invalid = checkGifAnimation(source);
  if (invalid) return invalid;
  const animation = foldGifAlpha(source);
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
