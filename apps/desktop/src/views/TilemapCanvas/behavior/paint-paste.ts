/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import type { Point } from '@bxel/document';
import { usableStamp } from '../../../tilemap/usable-stamp';
import type { PixelView } from '../../PixelViewport';
import type { MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintRegion } from './paint-region';
import { paintStamp } from './paint-stamp';

const paintPaste = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, shown: { at: Point; look: MapLook }): void => {
  const { paste, target } = state;
  if (!paste) return;
  const { at, look } = shown;
  paintStamp(ctx, { ...state, flags: NO_FLAGS }, usableStamp(paste.stamp, target.tileset), at);
  paintRegion(ctx, view, state, { cells: { ...at, width: paste.stamp.columns, height: paste.stamp.rows }, style: { colour: look.select, dashed: true } });
};

export { paintPaste };
