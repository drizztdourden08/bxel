/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintRegion } from './paint-region';

const paintSelection = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  if (state.selection) paintRegion(ctx, view, state, { cells: state.selection.rect, style: { colour: look.select, dashed: true } });
};

export { paintSelection };
