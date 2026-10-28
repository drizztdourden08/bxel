/* @layer renderer-app @kind logic */
import { PANEL_LABEL, PANEL_TEXT } from '../../../palette-panel/palette-panel.constants';
import { reorderStep } from '../../../palette-panel/reorder-step';
import { reorderSwatches } from '../../../palette-panel/reorder-swatches';
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import type { PanelModel } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const applyListOrder = (panel: PanelModel, rows: readonly PaletteSlot[]): void => {
  const { bank } = panel.target;
  const first = bank.slots[0];
  const rest = rows.flatMap((row) => (row.index === 0 ? [] : [String(bank.slots[row.index]?.id)]));
  const order = first ? [String(first.id), ...rest] : rest;
  const count = rest.length;
  reportOutcome(reorderSwatches(panel.target, PANEL_LABEL.sort, reorderStep(panel.target, order), PANEL_TEXT.ordered(count)), true);
};

export { applyListOrder };
