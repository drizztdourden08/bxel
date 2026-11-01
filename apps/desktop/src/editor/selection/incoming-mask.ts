/* @layer renderer-app @kind logic */
import { ellipseMask, lassoMask, polygonMask, rectMask } from '@bxel/raster';
import type { MaskView, Size } from '@bxel/raster';
import { PLAIN_HOLD } from './incoming-mask.constants';
import { marqueeRule } from './marquee-rule';
import { mirroredIncoming } from './mirrored-incoming';
import type { DragShape, ShapeHold } from './selection.type';
import { shapeCorners } from './shape-corners';

const shapeMask = (shape: DragShape, size: Size, hold: ShapeHold): MaskView => {
  if (shape.variant === 'lasso') return lassoMask(size, shape.path);
  if (shape.variant === 'polygon') return polygonMask(size, shape.path);
  const corners = shapeCorners(shape.from, shape.to, hold, marqueeRule());
  return shape.variant === 'ellipse' ? ellipseMask(size, corners) : rectMask(size, corners);
};

const incomingMask = (shape: DragShape, size: Size, hold: ShapeHold = PLAIN_HOLD): MaskView => mirroredIncoming(shapeMask(shape, size, hold));

export { incomingMask };
