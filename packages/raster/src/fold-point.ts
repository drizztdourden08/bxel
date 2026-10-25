/* @layer core @kind logic */
import { foldCoord } from './fold-coord';
import type { Point, Size } from './geometry.type';
import type { Wrap } from './wrap.type';

const foldPoint = (point: Point, room: Size, wrap: Wrap | undefined): Point => ({
  x: wrap?.x === true && room.width > 0 ? foldCoord(point.x, room.width) : point.x,
  y: wrap?.y === true && room.height > 0 ? foldCoord(point.y, room.height) : point.y,
});

export { foldPoint };
