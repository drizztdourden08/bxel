/* @layer renderer-app @kind logic */
import type { Point, Rect } from '@bxel/raster';
import type { Clip } from '../selection/selection.type';

const clipRect = (clip: Clip, offset: Point): Rect => ({
  x: clip.origin.x + offset.x,
  y: clip.origin.y + offset.y,
  width: clip.width,
  height: clip.height,
});

export { clipRect };
