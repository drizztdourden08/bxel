/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { constrainCorner } from './constrain-corner';
import type { ShapeSession } from './editor.type';
import { paintShape } from './paint-shape';
import { ratioSnap } from './ratio-snap';
import type { ShapeMods } from './shape-mods.type';

const same = (first: Point, second: Point): boolean => first.x === second.x && first.y === second.y;

const shifted = (point: Point, delta: Point): Point => ({ x: point.x + delta.x, y: point.y + delta.y });

const updateShape = (session: ShapeSession, at: Point, mods: ShapeMods): void => {
  const { spec } = session;
  const delta = { x: at.x - session.last.x, y: at.y - session.last.y };
  session.last = at;
  let from = spec.from;
  let to = spec.to;
  if (mods.move) {
    from = shifted(from, delta);
    to = shifted(to, delta);
    session.anchor = shifted(session.anchor, delta);
  } else {
    const corner = mods.constrain ? constrainCorner(spec.shape, session.anchor, at) : at;
    from = mods.centre ? { x: 2 * session.anchor.x - corner.x, y: 2 * session.anchor.y - corner.y } : session.anchor;
    to = corner;
  }
  session.label = mods.constrain && spec.shape === 'line' ? ratioSnap(session.anchor, at).label : '';
  if (same(from, spec.from) && same(to, spec.to)) return;
  session.spec = { ...spec, from, to };
  paintShape(session);
};

export { updateShape };
