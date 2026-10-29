/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { runDocument } from '../sheet/run-document';
import { framePick } from './frame-pick';
import { orderSteps } from './order-steps';
import { TIMELINE_LABEL, TIMELINE_TEXT } from './timeline.constants';

const reverseFrames = (): boolean => {
  const pick = framePick();
  if (!pick) return false;
  const { focus, order } = pick;
  const block = order.filter((id) => pick.picked.includes(id));
  if (block.length < 2) {
    useNoticeStore.getState().post(TIMELINE_TEXT.needTwo);
    return false;
  }
  const reversed = [...block].reverse();
  const desired = order.map((id) => (block.includes(id) ? (reversed[block.indexOf(id)] ?? id) : id));
  return runDocument(TIMELINE_LABEL.reverse, orderSteps(focus, order, desired)) !== null;
};

export { reverseFrames };
