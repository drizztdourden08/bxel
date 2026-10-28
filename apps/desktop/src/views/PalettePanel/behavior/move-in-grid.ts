/* @layer renderer-app @kind logic */
import { currentBank } from '../../../palette-panel/current-bank';
import { moveSwatches } from '../../../palette-panel/move-swatches';
import { swapSwatches } from '../../../palette-panel/swap-swatches';
import type { PanelModel } from '../PalettePanel.type';
import { gapFor } from './gap-for';
import { reportOutcome } from './report-outcome';

const moveInGrid = (panel: PanelModel, from: number, to: number, swap: boolean): string | null => {
  const { target, selection, lock } = panel;
  const id = target.bank.slots[from]?.id;
  if (lock.locked || id === undefined) return null;
  const block = selection.selected.has(from) && selection.selected.size > 1;
  const moving = block ? [...selection.selected].sort((first, second) => first - second) : [from];
  const outcome = swap ? swapSwatches(target, from, to) : moveSwatches(target, moving, gapFor(from, to));
  reportOutcome(outcome);
  if (!outcome.ok) return null;
  const landed = currentBank(target)?.slots.findIndex((slot) => slot.id === id) ?? to;
  selection.setFocus(landed);
  return String(id);
};

export { moveInGrid };
