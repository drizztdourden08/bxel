/* @layer core @kind logic */
import { flipPivot, turnPivot } from '@bxel/document';
import type { Pivot2 } from '@bxel/document';
import type { Size } from '../geometry.type';
import type { Orientation } from './transform.type';

const transformPivot = (orientation: Orientation, size: Size, pivot: Pivot2): Pivot2 => {
  switch (orientation) {
    case 'flip-horizontal':
      return flipPivot(pivot, size, 'horizontal');
    case 'flip-vertical':
      return flipPivot(pivot, size, 'vertical');
    case 'turn-clockwise':
      return turnPivot(pivot, size, 'clockwise');
    case 'turn-counter-clockwise':
      return turnPivot(pivot, size, 'counter-clockwise');
    case 'half-turn':
      return turnPivot(pivot, size, 'half');
  }
};

export { transformPivot };
