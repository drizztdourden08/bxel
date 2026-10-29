/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { ShapeSession, ShapeStart } from './editor.type';
import { paintShape } from './paint-shape';

const beginShape = (start: ShapeStart): ShapeSession => {
  const at = start.spec.from;
  const session: ShapeSession = { ...createOverlay(start.target), kind: 'shape', spec: start.spec, anchor: at, last: at, label: '' };
  paintShape(session);
  return session;
};

export { beginShape };
