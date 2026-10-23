/* @layer renderer-app @kind logic */
import type { FrameCache, FrameInput } from './viewport.type';
import { checkerTile } from './checker-tile';
import { paintChecker } from './paint-checker';
import { paintGrid } from './paint-grid';
import { paintImage } from './paint-image';
import { placeImage } from './place-image';
import { readLook } from './read-look';
import { viewOf } from './view-of';

const fitBackingStore = (canvas: HTMLCanvasElement, frame: FrameInput): void => {
  const width = Math.round(frame.box.width * frame.box.dpr);
  const height = Math.round(frame.box.height * frame.box.dpr);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
};

const paintFrame = (canvas: HTMLCanvasElement, root: HTMLElement, frame: FrameInput, cache: FrameCache): void => {
  fitBackingStore(canvas, frame);
  const ctx = canvas.getContext('2d');
  if (!ctx || canvas.width === 0 || canvas.height === 0) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const look = readLook(root);
  const view = viewOf(frame.target, frame.box, frame.image);
  const placed = placeImage(view);
  const tileKey = `${look.checkA}|${look.checkB}|${look.check}|${view.dpr}`;
  if (!cache.tile || cache.tileKey !== tileKey) {
    cache.tile = checkerTile(canvas.ownerDocument, look, view.dpr);
    cache.tileKey = tileKey;
  }
  paintChecker(ctx, placed, cache.tile);
  const scratch = () => {
    cache.scratch ??= canvas.ownerDocument.createElement('canvas');
    return cache.scratch;
  };
  paintImage({ ctx, placed, view, scratch }, frame);
  if (frame.gridFrom !== null && view.zoom >= frame.gridFrom) paintGrid(ctx, placed, frame.image, look.grid);
};

export { paintFrame };
