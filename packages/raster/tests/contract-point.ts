/* @layer tests @kind logic */
import { flipPoint, turnPoint } from '@bxel/document';
import type { Point, Size } from '@bxel/document';
import type { Orientation } from '@bxel/raster';

const contractPoint = (orientation: Orientation, point: Point, size: Size): Point => {
  switch (orientation) {
    case 'flip-horizontal':
      return flipPoint(point, size, 'horizontal');
    case 'flip-vertical':
      return flipPoint(point, size, 'vertical');
    case 'turn-clockwise':
      return turnPoint(point, size, 'clockwise');
    case 'turn-counter-clockwise':
      return turnPoint(point, size, 'counter-clockwise');
    case 'half-turn':
      return turnPoint(point, size, 'half');
  }
};

export { contractPoint };
