/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { reorderStep } from './reorder-step';
import { reorderSwatches } from './reorder-swatches';
import { swappedOrder } from './swapped-order';

const swapSwatches = (target: EditorTarget, first: number, second: number): PanelOutcome => {
  if (first <= 0 || second <= 0) return { ok: false, message: PANEL_TEXT.fixedSlot };
  const order = swappedOrder(target.bank, first, second);
  return reorderSwatches(target, PANEL_LABEL.swap, reorderStep(target, order), PANEL_TEXT.swapped(first, second));
};

export { swapSwatches };
