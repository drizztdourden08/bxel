/* @layer renderer-app @kind logic */
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { commitSession } from './commit-session';
import { pathReady } from './path-ready';
import type { PathPress } from './press-shape.type';
import { startSession } from './start-session';

const finish = ({ target, plan, points }: PathPress): string => {
  const list = [...points.current];
  points.current = [];
  const session = startSession(plan, target, list[0] ?? { x: 0, y: 0 });
  if (session.kind !== 'path') return ANNOUNCE_TEXT.blocked;
  session.vertices = list;
  session.hover = list.at(-1) ?? session.hover;
  session.phase = 'bend';
  if (session.tool === 'curve') session.vertices = [list[0] ?? session.hover, list[1] ?? session.hover];
  if (!pathReady(session)) return ANNOUNCE_TEXT.blocked;
  commitSession(session);
  return ANNOUNCE_TEXT.shapeDone;
};

const pressPath = (press: PathPress): string => {
  const { plan, at, points } = press;
  const last = points.current.at(-1);
  if (plan.tool === 'curve') {
    points.current = [...points.current, at];
    return points.current.length < 3 ? ANNOUNCE_TEXT.pointAdded(points.current.length, at.x, at.y) : finish(press);
  }
  if (last?.x === at.x && last.y === at.y) return finish(press);
  points.current = [...points.current, at];
  return ANNOUNCE_TEXT.pointAdded(points.current.length, at.x, at.y);
};

export { pressPath };
