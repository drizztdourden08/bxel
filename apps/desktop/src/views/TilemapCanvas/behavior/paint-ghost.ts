/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { orientStamp } from '../../../tilemap/orient-stamp';
import { usableStamp } from '../../../tilemap/usable-stamp';
import type { MapPaintState } from '../TilemapCanvas.type';
import { paintStamp } from './paint-stamp';

const paintGhost = (ctx: CanvasRenderingContext2D, state: MapPaintState, origin: Point): void => {
  const { target, stamp, flags } = state;
  paintStamp(ctx, state, orientStamp(usableStamp(stamp, target.tileset), flags), origin);
};

export { paintGhost };
