/* @layer renderer-app @kind logic */
import { ellipseMask, lassoMask, polygonMask, rectMask } from '@bxel/raster';
import type { MaskView, Size } from '@bxel/raster';
import type { DragShape } from './selection.type';

const incomingMask = (shape: DragShape, size: Size): MaskView => {
  const corners = { from: shape.from, to: shape.to };
  if (shape.variant === 'ellipse') return ellipseMask(size, corners);
  if (shape.variant === 'lasso') return lassoMask(size, shape.path);
  if (shape.variant === 'polygon') return polygonMask(size, shape.path);
  return rectMask(size, corners);
};

export { incomingMask };
