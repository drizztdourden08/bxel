/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { inBounds } from '../../../tilemap/in-bounds';
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintGhost } from './paint-ghost';
import { paintRegion } from './paint-region';

const paintHoverCursor = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, shown: { hover: Point; look: MapLook }): void => {
  const { hover, look } = shown;
  if (!inBounds(state.target.tilemap, hover) || state.tool === 'hand' || state.tool === 'zoom') return;
  const placing = state.tool === 'place';
  const footprint = { ...hover, width: placing ? state.stamp.columns : 1, height: placing ? state.stamp.rows : 1 };
  if (placing) paintGhost(ctx, state, hover);
  paintRegion(ctx, view, state, { cells: footprint, style: { colour: state.tool === 'erase' ? look.erase : look.cursor, dashed: false } });
};

export { paintHoverCursor };
