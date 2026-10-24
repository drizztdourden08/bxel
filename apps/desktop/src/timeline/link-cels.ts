/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { celSlot } from './cel-slot';
import { currentSelection } from './current-selection';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL, TIMELINE_TEXT } from './timeline.constants';

const linkCels = (): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { frames, layers } = currentSelection(target);
  const [source, ...rest] = frames;
  if (source === undefined || rest.length === 0) {
    useNoticeStore.getState().post(TIMELINE_TEXT.needTwoFrames);
    return false;
  }
  const steps = layers.flatMap((layerId) =>
    rest.map((frameId) => spriteStep(target, COMMAND_NAME.celLink, { from: celSlot(layerId, source), to: celSlot(layerId, frameId) })),
  );
  return runDocument(TIMELINE_LABEL.linkCel, steps) !== null;
};

export { linkCels };
