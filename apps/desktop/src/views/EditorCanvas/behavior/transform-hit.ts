/* @layer renderer-app @kind logic */
import { activeTransform } from '../../../editor/transform/active-transform';
import { hitHandle } from '../../../editor/transform/hit-handle';
import { pivotPoint } from '../../../editor/transform/pivot-point';
import { specQuad } from '../../../editor/transform/spec-quad';
import { transformBox } from '../../../editor/transform/transform-box';
import type { Handle } from '../../../editor/transform/transform.type';
import type { Rect, Point } from '@bxel/raster';
import type { TransformSpec } from '../../../editor/transform/transform.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

interface TransformHit {
  box: Rect;
  spec: TransformSpec;
  point: Point;
  handle: Handle | null;
}

const transformHit = (viewport: PixelViewportHandle | null, at: ClientPoint): TransformHit | null => {
  const active = activeTransform();
  const box = active ? transformBox(active.pending) : null;
  if (!active || !box || !viewport) return null;
  const point = viewport.screenToPixel(at.clientX, at.clientY);
  const pivot = pivotPoint(box, active.spec);
  const centre = active.spec.corners ? { x: Number.NaN, y: Number.NaN } : { x: pivot.x + active.spec.offset.x, y: pivot.y + active.spec.offset.y };
  const handle = hitHandle({ quad: specQuad(box, active.spec), pivot: centre, point, zoom: viewport.view().zoom });
  return { box, spec: active.spec, point, handle };
};

export { transformHit };
export type { TransformHit };
