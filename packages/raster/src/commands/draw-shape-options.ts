/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { drawShape } from '../draw-shape';
import type { Rect } from '../geometry.type';
import { drawPath } from '../path/draw-path';
import type { PixelsShapeOptions } from './schema/pixels-options.type';

const drawShapeOptions = (target: BufferView, options: PixelsShapeOptions): Rect | null => {
  const { index, mask, filled, brush, symmetry } = options;
  const base = { target, index, mask, filled, brush, symmetry };
  switch (options.shape) {
    case 'polygon':
    case 'contour':
      return drawPath({ ...base, kind: options.shape, points: options.points });
    case 'curve':
      return drawPath({ ...base, kind: 'curve', points: [options.from, options.control, options.to] });
    case 'line':
    case 'rect':
    case 'ellipse':
      return drawShape({ ...base, shape: options.shape, from: options.from, to: options.to });
  }
};

export { drawShapeOptions };
