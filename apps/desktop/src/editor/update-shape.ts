/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { constrainCorner } from './constrain-corner';
import type { ShapeSession } from './editor.type';
import { paintShape } from './paint-shape';

const updateShape = (session: ShapeSession, at: Point, constrain: boolean): void => {
  const { spec } = session;
  const to = constrain ? constrainCorner(spec.shape, spec.from, at) : at;
  if (to.x === spec.to.x && to.y === spec.to.y) return;
  session.spec = { ...spec, to };
  paintShape(session);
};

export { updateShape };
