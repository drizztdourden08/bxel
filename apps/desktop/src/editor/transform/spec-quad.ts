/* @layer renderer-app @kind logic */
import type { Quad, Rect } from '@bxel/raster';
import { boxCorners } from './box-corners';
import { mapPoint } from './map-point';
import type { TransformSpec } from './transform.type';

/** The four corners of the result, in the order top left, top right, bottom right, bottom left. */
const specQuad = (box: Rect, spec: TransformSpec): Quad => {
  if (spec.corners) return spec.corners;
  const [a, b, c, d] = boxCorners(box);
  return [mapPoint(box, spec, a), mapPoint(box, spec, b), mapPoint(box, spec, c), mapPoint(box, spec, d)];
};

export { specQuad };
