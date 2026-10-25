/* @layer renderer-app @kind logic */
import { createOverlay } from './create-overlay';
import type { StrokeSession, StrokeStart } from './editor.type';
import { extendStroke } from './extend-stroke';
import { ERASE_INDEX } from './stroke.constants';

const beginStroke = (start: StrokeStart): StrokeSession => {
  const { target, tool, index, options, at } = start;
  const session: StrokeSession = {
    ...createOverlay(target),
    kind: 'stroke',
    tool,
    index: tool === 'eraser' ? ERASE_INDEX : index,
    options,
    points: [],
    trails: [],
  };
  extendStroke(session, at);
  return session;
};

export { beginStroke };
