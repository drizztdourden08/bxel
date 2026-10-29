/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { framePick } from './frame-pick';
import { orderSteps } from './order-steps';
import { TIMELINE_LABEL } from './timeline.constants';

const moveFramesTo = (position: number, only?: readonly AnimFrameId[]): boolean => {
  const pick = framePick(only);
  if (!pick) return false;
  const { focus, order } = pick;
  const block = order.filter((id) => pick.picked.includes(id));
  const rest = order.filter((id) => !block.includes(id));
  const at = Math.min(Math.max(Math.round(position), 0), rest.length);
  const desired = [...rest.slice(0, at), ...block, ...rest.slice(at)];
  const steps = orderSteps(focus, order, desired);
  return steps.length > 0 && runDocument(TIMELINE_LABEL.moveFrame, steps) !== null;
};

export { moveFramesTo };
