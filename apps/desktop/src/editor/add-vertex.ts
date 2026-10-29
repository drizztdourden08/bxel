/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PathSession } from './editor.type';
import { paintPath } from './paint-path';
import { ratioSnap } from './ratio-snap';
import { samePoint } from './same-point';

const addVertex = (session: PathSession, at: Point, constrain: boolean): void => {
  const last = session.vertices.at(-1);
  const next = constrain && last ? ratioSnap(last, at).to : at;
  if (last && samePoint(last, next)) return;
  session.vertices.push(next);
  session.hover = next;
  paintPath(session);
};

export { addVertex };
