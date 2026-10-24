/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { ShapeSession, ShapeStart } from './editor.type';
import { paintShape } from './paint-shape';

const beginShape = (start: ShapeStart): ShapeSession => {
  const session: ShapeSession = { ...createOverlay(start.target), kind: 'shape', spec: start.spec };
  paintShape(session);
  return session;
};

export { beginShape };
