/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { celMoves } from './cel-moves';
import { celSlot } from './cel-slot';
import { currentSelection } from './current-selection';
import { shiftSelection } from './shift-selection';
import { spriteStep } from './sprite-step';
import { TIMELINE_LABEL, TIMELINE_TEXT } from './timeline.constants';
import type { CelMove } from './timeline.type';

const moveCels = (by: CelMove): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const selection = currentSelection(target);
  const moves = celMoves(target.sprite, selection, by);
  if (moves === null) {
    useNoticeStore.getState().post(TIMELINE_TEXT.nothingToMove);
    return false;
  }
  const steps = moves.map((move) =>
    spriteStep(target, COMMAND_NAME.celMove, { from: celSlot(move.layerId, move.frameId), to: celSlot(move.toLayer, move.toFrame) }),
  );
  if (steps.length === 0 || runDocument(TIMELINE_LABEL.moveCel, steps) === null) return false;
  const shifted = shiftSelection(target, selection, by);
  useTimelineStore.getState().select(shifted.selection, shifted.frameId);
  useToolStore.getState().setLayer(shifted.layerId);
  return true;
};

export { moveCels };
