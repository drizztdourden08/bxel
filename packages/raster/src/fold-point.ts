/* @layer core @kind logic */
import { foldCoord } from './fold-coord';
import type { Point } from './geometry.type';
import type { Wrap } from './wrap.type';

type Room = { readonly width: number; readonly height: number };

const foldPoint = (point: Point, room: Room, wrap: Wrap | undefined): Point => ({
  x: wrap?.x === true && room.width > 0 ? foldCoord(point.x, room.width) : point.x,
  y: wrap?.y === true && room.height > 0 ? foldCoord(point.y, room.height) : point.y,
});

export { foldPoint };
