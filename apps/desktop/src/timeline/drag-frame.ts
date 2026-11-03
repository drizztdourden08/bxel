/* @layer renderer-app @kind logic */
import type { ReorderDropInfo } from '@drizztdourden08/tessera';
import { copyFramesAt } from './copy-frames-at';
import { currentFocus } from './current-focus';
import { dragModeOf } from './drag-mode-of';
import { moveFramesTo } from './move-frames-to';

const dropFrames = (drop: ReorderDropInfo): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const order = focus.animation.frames.map((frame) => frame.id);
  const ids = order.filter((id) => drop.keys.includes(id));
  if (ids.length === 0) return false;
  const mode = dragModeOf(drop.modifier);
  if (mode !== 'move') return copyFramesAt(drop.before, mode === 'link', ids);
  const ahead = ids.filter((id) => order.indexOf(id) < drop.before).length;
  return moveFramesTo(drop.before - ahead, ids);
};

export { dropFrames };
