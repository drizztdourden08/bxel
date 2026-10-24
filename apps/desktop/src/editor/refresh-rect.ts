/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { markDirty } from '../canvas-dirty/mark-dirty';
import { CHANNELS } from './bank-table.constants';
import type { Overlay } from './editor.type';

const wordsOf = (bytes: Uint8ClampedArray): Uint32Array => new Uint32Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.length / CHANNELS));

const refreshRect = (overlay: Overlay, rect: Rect): void => {
  const { indices, rgba, table, width } = overlay;
  const pixels = wordsOf(rgba);
  const colours = wordsOf(table);
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    const row = y * width;
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      pixels[row + x] = colours[indices[row + x] ?? 0] ?? 0;
    }
  }
  markDirty(rgba, rect);
};

export { refreshRect };
