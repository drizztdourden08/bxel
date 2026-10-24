/* @layer renderer-app @kind logic */
import type { Point, Size } from '@bxel/raster';
import type { Clip } from '../selection/selection.type';

const fit = (offset: number, origin: number, extent: { clip: number; sprite: number }): number =>
  Math.max(-origin, Math.min(extent.sprite - extent.clip - origin, offset));

const fitOffset = (clip: Clip, offset: Point, size: Size): Point => ({
  x: fit(offset.x, clip.origin.x, { clip: clip.width, sprite: size.width }),
  y: fit(offset.y, clip.origin.y, { clip: clip.height, sprite: size.height }),
});

export { fitOffset };
