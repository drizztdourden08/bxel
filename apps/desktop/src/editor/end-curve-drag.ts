/* @layer renderer-app @kind logic */
import type { PathSession } from './editor.type';
import { paintPath } from './paint-path';

const endCurveDrag = (session: PathSession): void => {
  const start = session.vertices[0] ?? session.hover;
  session.vertices = [start, session.hover];
  session.phase = 'bend';
  paintPath(session);
};

export { endCurveDrag };
