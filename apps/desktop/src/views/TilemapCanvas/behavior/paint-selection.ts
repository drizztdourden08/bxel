/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { cellBox } from './cell-box';
import { paintBox } from './paint-box';

const paintSelection = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  if (state.selection) paintBox(ctx, view, cellBox(state.selection.rect, state.target.tileset), { colour: look.select, dashed: true });
};

export { paintSelection };
