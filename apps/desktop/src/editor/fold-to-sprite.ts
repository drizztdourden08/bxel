/* @layer renderer-app @kind logic */
import { foldPoint } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';
import { wrapOf } from './wrap-of';

const foldToSprite = (target: EditorTarget, at: Point): Point => foldPoint(at, target.sprite, wrapOf());

export { foldToSprite };
