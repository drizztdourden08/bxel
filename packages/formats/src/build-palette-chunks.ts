/* @layer core @kind logic */
import { PNG_CHUNK } from './png-chunk.constants';
import { PNG_ENCODE } from './png-encode.constants';
import type { PixelBytes } from './png.type';
import { writePngChunk } from './write-png-chunk';

const buildPaletteChunks = (palette: PixelBytes, entries: number): Uint8Array[] => {
  const plte = new Uint8Array(entries * 3);
  const alpha = new Uint8Array(entries);
  let transparentCount = 0;
  for (let i = 0; i < entries; i += 1) {
    plte[i * 3] = palette[i * 4] ?? 0;
    plte[i * 3 + 1] = palette[i * 4 + 1] ?? 0;
    plte[i * 3 + 2] = palette[i * 4 + 2] ?? 0;
    alpha[i] = palette[i * 4 + 3] ?? PNG_ENCODE.OPAQUE_ALPHA;
    if (alpha[i] !== PNG_ENCODE.OPAQUE_ALPHA) transparentCount = i + 1;
  }
  const chunks = [writePngChunk(PNG_CHUNK.PLTE, plte)];
  if (transparentCount > 0) {
    chunks.push(writePngChunk(PNG_CHUNK.TRNS, alpha.subarray(0, transparentCount)));
  }
  return chunks;
};

export { buildPaletteChunks };
