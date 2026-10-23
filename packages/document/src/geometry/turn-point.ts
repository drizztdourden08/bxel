/* @layer core @kind logic */
import type { Point, Size, TurnDirection } from '../model/geometry.type';

const turnPoint = (point: Point, size: Size, direction: TurnDirection): Point => {
  switch (direction) {
    case 'clockwise':
      return { x: size.height - 1 - point.y, y: point.x };
    case 'counter-clockwise':
      return { x: point.y, y: size.width - 1 - point.x };
    case 'half':
      return { x: size.width - 1 - point.x, y: size.height - 1 - point.y };
  }
};

export { turnPoint };
