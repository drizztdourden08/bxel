/* @layer renderer-app @kind logic */
import { fillTiled } from '../../../canvas-look/fill-tiled';
import { gridLayers } from '../../../canvas-look/grid-layers';
import type { FrameCache, FrameInput } from './viewport.type';
import { paintGrid } from './paint-grid';
import { paintImage } from './paint-image';
import { placeImage } from './place-image';
import { refreshTiles } from './refresh-tiles';
import { tilePlacements } from './tile-placements';
import { viewOf } from './view-of';

const fitBackingStore = (canvas: HTMLCanvasElement, frame: FrameInput): void => {
  const width = Math.round(frame.box.width * frame.box.dpr);
  const height = Math.round(frame.box.height * frame.box.dpr);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
};

const paintFrame = (canvas: HTMLCanvasElement, frame: FrameInput, cache: FrameCache): void => {
  fitBackingStore(canvas, frame);
  const ctx = canvas.getContext('2d');
  if (!ctx || canvas.width === 0 || canvas.height === 0) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const view = viewOf(frame.target, frame.box, frame.image);
  const placed = placeImage(view);
  refreshTiles(canvas.ownerDocument, frame.look, view.dpr, cache);
  if (cache.surround) fillTiled(ctx, cache.surround, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  const layers = gridLayers(frame.look, frame.grids, view.zoom, frame.gridFrom);
  const scratch = () => {
    cache.scratch ??= canvas.ownerDocument.createElement('canvas');
    return cache.scratch;
  };
  tilePlacements(placed, frame.tiled, canvas).forEach((tile, at) => {
    if (cache.tile) fillTiled(ctx, cache.tile, tile);
    paintImage({ ctx, placed: tile, view, scratch, primary: at === 0 }, frame);
    layers.forEach((layer) => paintGrid(ctx, tile, frame.image, layer));
  });
};

export { paintFrame };
