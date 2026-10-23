/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { CHANNELS } from './bank-table.constants';
import type { StrokeSession } from './editor.type';

const refreshRect = (session: StrokeSession, rect: Rect): void => {
  const { indices, rgba, table, width } = session;
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const offset = y * width + x;
      const from = (indices[offset] ?? 0) * CHANNELS;
      rgba.set(table.subarray(from, from + CHANNELS), offset * CHANNELS);
    }
  }
};

export { refreshRect };
