/* @layer renderer-app @kind logic */
import type { PathSession } from './editor.type';
import { paintPath } from './paint-path';

const dropVertex = (session: PathSession): void => {
  if (session.vertices.length <= 1) return;
  session.vertices.pop();
  session.hover = session.vertices.at(-1) ?? session.hover;
  paintPath(session);
};

export { dropVertex };
