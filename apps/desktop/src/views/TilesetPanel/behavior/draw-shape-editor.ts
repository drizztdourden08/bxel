/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { outlinePoints } from '../../../tilemap/collision/outline-points';
import type { EditorPaint } from './draw-shape-editor.type';
import { layerColour } from './layer-colour';
import { EDITOR_LOOK } from './thumb.constants';

const trace = (ctx: CanvasRenderingContext2D, points: readonly Point[], zoom: number): void => {
  ctx.beginPath();
  points.forEach((point, at) => (at === 0 ? ctx.moveTo(point.x * zoom, point.y * zoom) : ctx.lineTo(point.x * zoom, point.y * zoom)));
  ctx.closePath();
};

const drawShapeEditor = (canvas: HTMLCanvasElement, paint: EditorPaint): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { tileset, zoom } = paint;
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  canvas.width = size.width * zoom;
  canvas.height = size.height * zoom;
  ctx.imageSmoothingEnabled = false;
  if (paint.tile) ctx.drawImage(paint.tile, 0, 0, canvas.width, canvas.height);
  const all = paint.preview ? [...paint.shapes, paint.preview] : paint.shapes;
  all.forEach((shape, at) => {
    const colour = layerColour(canvas, tileset, shape.layer);
    const chosen = at === paint.selected || shape === paint.preview;
    const points = outlinePoints(shape, size);
    trace(ctx, points, zoom);
    ctx.globalAlpha = chosen ? EDITOR_LOOK.fillChosen : EDITOR_LOOK.fill;
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colour;
    ctx.lineWidth = chosen ? EDITOR_LOOK.lineChosen : EDITOR_LOOK.line;
    ctx.setLineDash(shape.oneWay ? [EDITOR_LOOK.dash, EDITOR_LOOK.dash] : []);
    ctx.stroke();
    if (chosen && shape.kind === 'polygon') {
      for (const point of points) ctx.fillRect(point.x * zoom - EDITOR_LOOK.handle, point.y * zoom - EDITOR_LOOK.handle, 2 * EDITOR_LOOK.handle, 2 * EDITOR_LOOK.handle);
    }
  });
  ctx.setLineDash([]);
};

export { drawShapeEditor };
