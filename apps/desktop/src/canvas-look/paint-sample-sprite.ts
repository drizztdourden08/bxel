/* @layer renderer-app @kind logic */
import { sampleColour } from '../platform-preset/sample-colour';
import type { CanvasLook, SampleSprite, TileRect } from './canvas-look.type';
import { checkerTile } from './checker-tile';
import { dprOf } from './dpr-of';
import { fillTiled } from './fill-tiled';
import { fitCanvas } from './fit-canvas';

const paintPixels = (ctx: CanvasRenderingContext2D, sample: SampleSprite, rect: TileRect, zoom: number): void => {
  const [width, height] = sample.size;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const colour = sampleColour(x, y, sample.size, sample.colours);
      if (colour === null) continue;
      ctx.fillStyle = colour;
      ctx.fillRect(rect.x + x * zoom, rect.y + y * zoom, zoom, zoom);
    }
  }
};

const paintTileLines = (ctx: CanvasRenderingContext2D, sample: SampleSprite, rect: TileRect, look: CanvasLook): void => {
  if (sample.tile === null) return;
  const [tileW, tileH] = sample.tile;
  const zoom = rect.width / sample.size[0];
  ctx.globalAlpha = look.tileLine.opacity;
  ctx.fillStyle = look.tileLine.colour;
  for (let x = tileW; x < sample.size[0]; x += tileW) ctx.fillRect(rect.x + x * zoom, rect.y, 1, rect.height);
  for (let y = tileH; y < sample.size[1]; y += tileH) ctx.fillRect(rect.x, rect.y + y * zoom, rect.width, 1);
  ctx.globalAlpha = 1;
};

const paintSampleSprite = (canvas: HTMLCanvasElement, sample: SampleSprite, look: CanvasLook): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  const [width, height] = sample.size;
  const zoom = Math.max(1, Math.floor(Math.min(canvas.width / width, canvas.height / height)));
  const rect = {
    x: Math.floor((canvas.width - width * zoom) / 2),
    y: Math.floor((canvas.height - height * zoom) / 2),
    width: width * zoom,
    height: height * zoom,
  };
  fillTiled(ctx, checkerTile(canvas.ownerDocument, look, dprOf(canvas)), rect);
  paintPixels(ctx, sample, rect, zoom);
  paintTileLines(ctx, sample, rect, look);
};

export { paintSampleSprite };
