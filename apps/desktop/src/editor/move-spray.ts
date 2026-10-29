/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { SpraySession } from './editor.type';

const moveSpray = (session: SpraySession, at: Point, pressure = 1): void => {
  session.at = at;
  session.pressure = pressure;
};

export { moveSpray };
