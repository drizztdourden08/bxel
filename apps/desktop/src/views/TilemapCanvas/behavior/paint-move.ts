/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import { blockStamp } from '../../../tilemap/block-stamp';
import { clampBy } from '../../../tilemap/clamp-by';
import type { PixelView } from '../../PixelViewport';
import type { MapDrag, MapLook, MapPaintState } from '../TilemapCanvas.type';
import { paintMask } from './paint-mask';
import { paintRegion } from './paint-region';
import { paintStamp } from './paint-stamp';

const paintMove = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, drag: Extract<MapDrag, { kind: 'move' }>, look: MapLook): void => {
  const { selection, target } = state;
  if (!selection) return;
  const by = clampBy({ x: drag.to.x - drag.from.x, y: drag.to.y - drag.from.y }, selection.rect, target.tilemap);
  const rect = { ...selection.rect, x: selection.rect.x + by.x, y: selection.rect.y + by.y };
  paintStamp(ctx, { ...state, flags: NO_FLAGS }, blockStamp(target, selection.rect, selection.mask), rect);
  const style = { colour: look.select, dashed: false };
  if (selection.mask === null) paintRegion(ctx, view, state, { cells: rect, style });
  else paintMask(ctx, view, state, { rect, mask: selection.mask }, style);
};

export { paintMove };
