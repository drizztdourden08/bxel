/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { movedOrder } from './moved-order';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { reorderStep } from './reorder-step';
import { reorderSwatches } from './reorder-swatches';

const moveSwatches = (target: EditorTarget, moving: readonly number[], gap: number): PanelOutcome => {
  const { bank } = target;
  const valid = moving.filter((index) => index > 0 && index < bank.slots.length);
  const first = valid[0];
  if (first === undefined) return { ok: false, message: PANEL_TEXT.fixedSlot };
  const order = movedOrder(bank, valid, gap);
  const landed = order.indexOf(String(bank.slots[first]?.id));
  return reorderSwatches(target, PANEL_LABEL.move, reorderStep(target, order), PANEL_TEXT.moved(first, landed, bank.slots.length));
};

export { moveSwatches };
