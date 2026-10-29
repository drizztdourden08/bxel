/* @layer renderer-app @kind logic */
import type { PathSession } from './editor.type';

const pathReady = (session: PathSession): boolean => {
  if (session.tool === 'polygon') return session.vertices.length >= 3;
  if (session.tool === 'contour') return session.vertices.length >= 2;
  return session.phase === 'bend' && session.vertices.length === 2;
};

export { pathReady };
