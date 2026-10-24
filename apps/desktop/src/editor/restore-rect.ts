/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import type { Overlay } from './editor.type';

const restoreRect = (overlay: Overlay, rect: Rect): void => {
  const { base, indices, width } = overlay;
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    const from = y * width + rect.x;
    indices.set(base.subarray(from, from + rect.width), from);
  }
};

export { restoreRect };
