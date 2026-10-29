/* @layer renderer-app @kind logic */
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintHoverCursor } from './paint-hover-cursor';
import { paintPaste } from './paint-paste';

const paintHover = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, look: MapLook): void => {
  const { hover, drag } = state.live;
  if (!hover || drag) return;
  if (state.paste) paintPaste(ctx, view, state, { at: hover, look });
  else paintHoverCursor(ctx, view, state, { hover, look });
};

export { paintHover };
