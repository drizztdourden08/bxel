/* @layer renderer-app @kind logic */
import { foldPoint } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';
import { insideSprite } from './inside-sprite';
import { wrapOf } from './wrap-of';

const insidePaintArea = (target: EditorTarget, at: Point): boolean =>
  insideSprite(target, foldPoint(at, target.sprite, wrapOf()));

export { insidePaintArea };
