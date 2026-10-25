/* @layer renderer-app @kind logic */
import type { BrushStamp, Point, Rect } from '@bxel/raster';
import type { Overlay } from './editor.type';
import { restoreRect } from './restore-rect';
import { unionDirty } from './union-dirty';

const footprint = (overlay: Overlay, stamp: BrushStamp, point: Point): Rect | null => {
  const left = Math.max(0, point.x - stamp.offset);
  const top = Math.max(0, point.y - stamp.offset);
  const right = Math.min(overlay.width, point.x - stamp.offset + stamp.size);
  const bottom = Math.min(overlay.height, point.y - stamp.offset + stamp.size);
  return right > left && bottom > top ? { x: left, y: top, width: right - left, height: bottom - top } : null;
};

const clearFootprints = (overlay: Overlay, stamp: BrushStamp, points: readonly Point[]): Rect | null => {
  let cleared: Rect | null = null;
  for (const point of points) {
    const rect = footprint(overlay, stamp, point);
    if (!rect) continue;
    restoreRect(overlay, rect);
    cleared = unionDirty(cleared, rect);
  }
  return cleared;
};

export { clearFootprints };
