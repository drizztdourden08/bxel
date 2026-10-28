/* @layer renderer-app @kind logic */
import { ellipseMask, lassoMask, polygonMask, rectMask } from '@bxel/raster';
import type { MaskView, Size } from '@bxel/raster';
import { PLAIN_HOLD } from './incoming-mask.constants';
import type { DragShape, ShapeHold } from './selection.type';
import { shapeCorners } from './shape-corners';

const incomingMask = (shape: DragShape, size: Size, hold: ShapeHold = PLAIN_HOLD): MaskView => {
  const corners = shapeCorners(shape.from, shape.to, hold);
  if (shape.variant === 'ellipse') return ellipseMask(size, corners);
  if (shape.variant === 'lasso') return lassoMask(size, shape.path);
  if (shape.variant === 'polygon') return polygonMask(size, shape.path);
  return rectMask(size, corners);
};

export { incomingMask };
