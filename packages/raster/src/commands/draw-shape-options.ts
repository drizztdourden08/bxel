/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { drawShape } from '../draw-shape';
import type { Point, Rect } from '../geometry.type';
import type { InkRule } from '../ink/ink.type';
import { drawPath } from '../path/draw-path';
import type { PixelsShapeOptions } from './schema/pixels-options.type';

const curveHandles = (options: Extract<PixelsShapeOptions, { shape: 'curve' }>): Point[] =>
  options.control2 === undefined ? [options.from, options.control, options.to] : [options.from, options.control, options.control2, options.to];

const drawShapeOptions = (target: BufferView, options: PixelsShapeOptions, ink: InkRule | null = null): Rect | null => {
  const { index, mask, wrap, filled, fillIndex, brush, symmetry } = options;
  const base = { target, index, mask, wrap, filled, fillIndex, brush, symmetry, ink };
  switch (options.shape) {
    case 'polygon':
      return drawPath({ ...base, kind: 'polygon', points: options.points });
    case 'contour':
      return drawPath({ ...base, kind: 'contour', points: options.points, pixelPerfect: options.pixelPerfect });
    case 'curve':
      return drawPath({ ...base, kind: 'curve', points: curveHandles(options), pixelPerfect: options.pixelPerfect });
    case 'line':
    case 'rect':
    case 'ellipse':
      return drawShape({ ...base, shape: options.shape, from: options.from, to: options.to, radius: options.radius, evenSteps: options.evenSteps });
  }
};

export { drawShapeOptions };
