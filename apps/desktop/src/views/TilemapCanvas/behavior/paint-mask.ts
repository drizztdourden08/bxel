/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import type { PixelView } from '../../PixelViewport';
import { CURSOR_LINE, HALO, SHADE_ALPHA } from '../TilemapCanvas.constants';
import type { BoxStyle, MapPaintState } from '../TilemapCanvas.type';
import { applyStroke } from './apply-stroke';
import { paintRegion } from './paint-region';

const edge = (ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number]): void => {
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
};

const paintMask = (ctx: CanvasRenderingContext2D, view: PixelView, state: MapPaintState, shape: { rect: Rect; mask: Uint8Array; style: BoxStyle }): void => {
  const { rect, mask, style } = shape;
  if (state.target.tilemap.orientation) {
    mask.forEach((bit, at) => {
      if (bit === 1) paintRegion(ctx, view, state, { cells: { x: rect.x + (at % rect.width), y: rect.y + Math.floor(at / rect.width), width: 1, height: 1 }, style });
    });
    return;
  }
  const { tileWidth: w, tileHeight: h } = state.target.tileset;
  const has = (column: number, row: number): boolean => column >= 0 && row >= 0 && column < rect.width && row < rect.height && mask[row * rect.width + column] === 1;
  ctx.save();
  ctx.globalAlpha = SHADE_ALPHA;
  ctx.fillStyle = style.colour;
  ctx.beginPath();
  for (let row = 0; row < rect.height; row += 1) {
    for (let column = 0; column < rect.width; column += 1) {
      if (!has(column, row)) continue;
      const left = (rect.x + column) * w;
      const top = (rect.y + row) * h;
      ctx.fillRect(left, top, w, h);
      if (!has(column, row - 1)) edge(ctx, [left, top], [left + w, top]);
      if (!has(column, row + 1)) edge(ctx, [left, top + h], [left + w, top + h]);
      if (!has(column - 1, row)) edge(ctx, [left, top], [left, top + h]);
      if (!has(column + 1, row)) edge(ctx, [left + w, top], [left + w, top + h]);
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = HALO;
  ctx.lineWidth = (2 * CURSOR_LINE) / view.zoom;
  ctx.stroke();
  applyStroke(ctx, view, style);
  ctx.stroke();
  ctx.restore();
};

export { paintMask };
