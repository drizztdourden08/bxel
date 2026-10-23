/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';

const insideSprite = (target: EditorTarget, at: Point): boolean =>
  at.x >= 0 && at.y >= 0 && at.x < target.sprite.width && at.y < target.sprite.height;

export { insideSprite };
