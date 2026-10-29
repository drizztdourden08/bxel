/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { PathSession } from './editor.type';

const middle = (first: Point, second: Point): Point => ({ x: Math.round((first.x + second.x) / 2), y: Math.round((first.y + second.y) / 2) });

const pathPoints = (session: PathSession): Point[] => {
  const [first = session.hover, second = session.hover] = session.vertices;
  if (session.tool === 'curve') {
    if (session.phase === 'draw') return [first, middle(first, session.hover), session.hover];
    return session.handle ? [first, session.handle, session.hover, second] : [first, session.hover, second];
  }
  return session.tool === 'polygon' ? [...session.vertices, session.hover] : session.vertices;
};

export { pathPoints };
