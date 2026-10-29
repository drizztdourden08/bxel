/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintMask } from './paint-mask';
import { paintRegion } from './paint-region';

const paintSelection = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { selection } = state;
  if (!selection) return;
  const style = { colour: look.select, dashed: true };
  if (selection.mask === null) paintRegion(ctx, view, state, { cells: selection.rect, style });
  else paintMask(ctx, view, state, { rect: selection.rect, mask: selection.mask }, style);
};

export { paintSelection };
