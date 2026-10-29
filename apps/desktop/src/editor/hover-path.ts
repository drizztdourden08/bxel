/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PathSession } from './editor.type';
import { NOWHERE } from './hover-path.constants';
import { paintPath } from './paint-path';
import { ratioSnap } from './ratio-snap';
import { samePoint } from './same-point';

const hoverPath = (session: PathSession, at: Point, constrain: boolean): void => {
  const last = session.vertices.at(-1);
  const next = session.tool === 'polygon' && constrain && last ? ratioSnap(last, at).to : at;
  if (session.tool === 'contour') {
    if (!samePoint(next, last ?? NOWHERE)) session.vertices.push(next);
  } else if (samePoint(next, session.hover)) {
    return;
  }
  session.hover = next;
  paintPath(session);
};

export { hoverPath };
