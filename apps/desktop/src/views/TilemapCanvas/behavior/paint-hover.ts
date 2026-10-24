/* @layer renderer-app @kind logic */
import { inBounds } from '../../../tilemap/in-bounds';
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { cellBox } from './cell-box';
import { paintBox } from './paint-box';
import { paintGhost } from './paint-ghost';

const paintHover = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { hover, drag } = state.live;
  if (!hover || drag || !inBounds(state.target.tilemap, hover) || state.tool === 'hand' || state.tool === 'zoom') return;
  const placing = state.tool === 'place';
  const footprint = { ...hover, width: placing ? state.stamp.columns : 1, height: placing ? state.stamp.rows : 1 };
  if (placing) paintGhost(ctx, state, hover);
  paintBox(ctx, view, cellBox(footprint, state.target.tileset), { colour: state.tool === 'erase' ? look.erase : look.cursor, dashed: false });
};

export { paintHover };
