/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { SpraySession } from './editor.type';

const moveSpray = (session: SpraySession, at: Point): void => {
  session.at = at;
};

export { moveSpray };
