/* @layer renderer-app @kind logic */
import { copyFramesAt } from './copy-frames-at';
import { framePick } from './frame-pick';

const linkedCopy = (): boolean => {
  const pick = framePick();
  if (!pick) return false;
  const last = Math.max(...pick.picked.map((id) => pick.order.indexOf(id)));
  return copyFramesAt(last + 1, true);
};

export { linkedCopy };
