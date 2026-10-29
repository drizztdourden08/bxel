/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile, Tileset } from '@bxel/document';
import { outlinePoints } from '../../../tilemap/collision/outline-points';
import { layerColour } from './layer-colour';
import { THUMB_LOOK } from './thumb.constants';

const drawShapes = (canvas: HTMLCanvasElement, tileset: Tileset, tile: Tile, zoom: number): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  for (const shape of tileShapes(tile)) {
    const colour = layerColour(canvas, tileset, shape.layer);
    ctx.beginPath();
    outlinePoints(shape, size).forEach((point, at) => (at === 0 ? ctx.moveTo(point.x * zoom, point.y * zoom) : ctx.lineTo(point.x * zoom, point.y * zoom)));
    ctx.closePath();
    ctx.globalAlpha = THUMB_LOOK.fill;
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colour;
    ctx.lineWidth = THUMB_LOOK.line;
    ctx.setLineDash(shape.oneWay ? [THUMB_LOOK.dash, THUMB_LOOK.dash] : []);
    ctx.stroke();
  }
  ctx.setLineDash([]);
};

export { drawShapes };
