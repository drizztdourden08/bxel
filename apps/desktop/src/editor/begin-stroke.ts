/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { bankTable } from './bank-table';
import { CHANNELS } from './bank-table.constants';
import type { StrokeSession, StrokeStart } from './editor.type';
import { extendStroke } from './extend-stroke';
import { refreshRect } from './refresh-rect';
import { ERASE_INDEX } from './stroke.constants';

const beginStroke = (start: StrokeStart): StrokeSession => {
  const { target, tool, index, brush, at } = start;
  const { sprite, bank, frameId } = target;
  const session: StrokeSession = {
    tool,
    index: tool === 'eraser' ? ERASE_INDEX : index,
    brush,
    width: sprite.width,
    height: sprite.height,
    indices: flattenFrame(sprite, frameId),
    rgba: new Uint8ClampedArray(sprite.width * sprite.height * CHANNELS),
    table: bankTable(bank),
    points: [],
  };
  refreshRect(session, { x: 0, y: 0, width: sprite.width, height: sprite.height });
  extendStroke(session, at);
  return session;
};

export { beginStroke };
