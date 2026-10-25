/* @layer renderer-app @kind logic */
import type { BrushStamp, Point, Rect, Wrap } from '@bxel/raster';
import type { Overlay } from './editor.type';
import { restoreRect } from './restore-rect';
import { unionDirty } from './union-dirty';
import { wrapRuns } from './wrap-runs';

const footprints = (overlay: Overlay, stamp: BrushStamp, point: Point, wrap: Wrap | undefined): Rect[] => {
  const columns = wrapRuns({ start: point.x - stamp.offset, length: stamp.size, room: overlay.width, wrapped: wrap?.x === true });
  const rows = wrapRuns({ start: point.y - stamp.offset, length: stamp.size, room: overlay.height, wrapped: wrap?.y === true });
  return rows.flatMap((row) => columns.map((column) => ({ x: column.start, y: row.start, width: column.length, height: row.length })));
};

const clearFootprints = (overlay: Overlay, stamp: BrushStamp, points: readonly Point[], wrap?: Wrap): Rect | null => {
  let cleared: Rect | null = null;
  for (const point of points) {
    for (const rect of footprints(overlay, stamp, point, wrap)) {
      restoreRect(overlay, rect);
      cleared = unionDirty(cleared, rect);
    }
  }
  return cleared;
};

export { clearFootprints };
