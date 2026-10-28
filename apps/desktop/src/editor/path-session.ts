/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PathSession } from './editor.type';
import { paintPath } from './paint-path';
import { ratioSnap } from './ratio-snap';

const same = (first: Point, second: Point): boolean => first.x === second.x && first.y === second.y;

const hoverPath = (session: PathSession, at: Point, constrain: boolean): void => {
  const last = session.vertices.at(-1);
  const next = session.tool === 'polygon' && constrain && last ? ratioSnap(last, at).to : at;
  if (session.tool === 'contour') {
    if (!same(next, session.vertices.at(-1) ?? { x: Number.NaN, y: Number.NaN })) session.vertices.push(next);
  } else if (same(next, session.hover)) {
    return;
  }
  session.hover = next;
  paintPath(session);
};

const addVertex = (session: PathSession, at: Point, constrain: boolean): void => {
  const last = session.vertices.at(-1);
  const next = constrain && last ? ratioSnap(last, at).to : at;
  if (last && same(last, next)) return;
  session.vertices.push(next);
  session.hover = next;
  paintPath(session);
};

const dropVertex = (session: PathSession): void => {
  if (session.vertices.length <= 1) return;
  session.vertices.pop();
  session.hover = session.vertices.at(-1) ?? session.hover;
  paintPath(session);
};

const endCurveDrag = (session: PathSession): void => {
  const start = session.vertices[0] ?? session.hover;
  session.vertices = [start, session.hover];
  session.phase = 'bend';
  paintPath(session);
};

const pathReady = (session: PathSession): boolean => {
  if (session.tool === 'polygon') return session.vertices.length >= 3;
  if (session.tool === 'contour') return session.vertices.length >= 2;
  return session.phase === 'bend' && session.vertices.length === 2;
};

export { addVertex, dropVertex, endCurveDrag, hoverPath, pathReady };
