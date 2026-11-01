/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { markDirty } from '../canvas-dirty/mark-dirty';
import { CHANNELS } from './bank-table.constants';
import { blendOver } from './blend-over';
import type { Overlay } from './editor.type';
import type { OverlayView } from './overlay-view.type';

const refreshViewRect = (overlay: Overlay, view: OverlayView, rect: Rect): void => {
  const { base, indices, rgba, table, width } = overlay;
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const position = y * width + x;
      const at = position * CHANNELS;
      const index = indices[position] ?? 0;
      if (index === (base[position] ?? 0)) {
        rgba.set(view.committed.subarray(at, at + CHANNELS), at);
        continue;
      }
      rgba.set(view.below.subarray(at, at + CHANNELS), at);
      if (index !== 0) blendOver(rgba, at, { data: table, from: index * CHANNELS }, view.alpha);
      blendOver(rgba, at, { data: view.above, from: at }, 1);
    }
  }
  markDirty(rgba, rect);
};

export { refreshViewRect };
