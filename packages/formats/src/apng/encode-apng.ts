/* @layer core @kind logic */
import type { ApngAnimation } from '../animation/animation.type';
import type { FormatBytesResult } from '../failure/format.type';
import { isFormatFailure } from '../failure/is-format-failure';
import { buildPaletteChunks } from '../build-palette-chunks';
import { concatBytes } from '../concat-bytes';
import type { PngChunks } from '../png-decode.type';
import { PNG_CHUNK } from '../png-chunk.constants';
import { PNG_SIGNATURE } from '../png-signature.constants';
import { writePngChunk } from '../write-png-chunk';
import { checkApngAnimation } from './check-apng-animation';
import { encodeApngFrame } from './encode-apng-frame';
import { writeActl } from './write-actl';
import { writeFctl } from './write-fctl';
import { writeFdat } from './write-fdat';

const encodeApng = (animation: ApngAnimation): FormatBytesResult => {
  const invalid = checkApngAnimation(animation);
  if (invalid) return invalid;
  const encoded: PngChunks[] = [];
  for (const frame of animation.frames) {
    const chunks = encodeApngFrame(animation, frame);
    if (isFormatFailure(chunks)) return chunks;
    encoded.push(chunks);
  }
  const first = encoded[0];
  if (!first) return { ok: true, bytes: new Uint8Array(0) };
  const size = { width: animation.width, height: animation.height };
  const parts: Uint8Array[] = [PNG_SIGNATURE, writePngChunk(PNG_CHUNK.IHDR, first.ihdr)];
  if (animation.palette) parts.push(...buildPaletteChunks(animation.palette, animation.palette.length / 4));
  parts.push(writeActl(encoded.length, animation.loops));
  encoded.forEach((chunks, i) => {
    const delayMs = animation.frames[i]?.delayMs ?? 1;
    parts.push(writeFctl(i === 0 ? 0 : 2 * i - 1, size, delayMs));
    parts.push(i === 0 ? writePngChunk(PNG_CHUNK.IDAT, chunks.idat) : writeFdat(2 * i, chunks.idat));
  });
  parts.push(writePngChunk(PNG_CHUNK.IEND, new Uint8Array(0)));
  return { ok: true, bytes: concatBytes(parts) };
};

export { encodeApng };
