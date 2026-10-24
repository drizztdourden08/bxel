/* @layer renderer-app @kind logic */
import { mirrorPoints } from '@bxel/raster';
import type { Symmetry } from '@bxel/raster';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelView } from '../../PixelViewport';
import { AXIS_DASH } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';
import { cursorFootprint } from './cursor-footprint';

const paintCursor = (ctx: CanvasRenderingContext2D, view: PixelView, symmetry: Symmetry, look: OverlayLook): void => {
  const pointer = useReadoutStore.getState().pointer;
  const size = cursorFootprint(useToolStore.getState());
  if (!pointer || size === 0) return;
  const offset = Math.floor((size - 1) / 2);
  ctx.save();
  ctx.lineWidth = 1 / view.zoom;
  mirrorPoints({ points: [pointer], symmetry, span: size }).forEach((points, at) => {
    const cell = points[0];
    if (!cell) return;
    ctx.strokeStyle = at === 0 ? look.cursor : look.axis;
    ctx.setLineDash(at === 0 ? [] : AXIS_DASH.map((part) => part / view.zoom));
    ctx.strokeRect(cell.x - offset, cell.y - offset, size, size);
  });
  ctx.restore();
};

export { paintCursor };
