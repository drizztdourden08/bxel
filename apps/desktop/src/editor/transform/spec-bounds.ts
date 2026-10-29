/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { specQuad } from './spec-quad';
import type { TransformSpec } from './transform.type';

const specBounds = (box: Rect, spec: TransformSpec): Rect => {
  const quad = specQuad(box, spec);
  const xs = quad.map((corner) => corner.x);
  const ys = quad.map((corner) => corner.y);
  const left = Math.floor(Math.min(...xs) + Number.EPSILON);
  const top = Math.floor(Math.min(...ys) + Number.EPSILON);
  return { x: left, y: top, width: Math.ceil(Math.max(...xs)) - left, height: Math.ceil(Math.max(...ys)) - top };
};

export { specBounds };
