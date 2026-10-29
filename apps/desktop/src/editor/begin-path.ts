/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { PathStart } from './begin-path.type';
import type { PathSession } from './editor.type';
import { paintPath } from './paint-path';

const beginPath = ({ target, tool, spec, at }: PathStart): PathSession => {
  const session: PathSession = { ...createOverlay(target), kind: 'path', tool, spec, vertices: [at], hover: at, handle: null, phase: 'draw' };
  paintPath(session);
  return session;
};

export { beginPath };
