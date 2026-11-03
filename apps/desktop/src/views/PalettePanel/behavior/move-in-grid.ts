/* @layer renderer-app @kind logic */
import type { VirtualGridMove } from '@drizztdourden08/tessera';
import { currentBank } from '../../../palette-panel/current-bank';
import { moveSwatches } from '../../../palette-panel/move-swatches';
import { swapSwatches } from '../../../palette-panel/swap-swatches';
import type { PanelModel } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const moveInGrid = (panel: PanelModel, move: VirtualGridMove): void => {
  const { target, selection, lock } = panel;
  const moving = move.keys
    .map((key) => target.bank.slots.findIndex((slot) => String(slot.id) === key))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second);
  const from = moving[0];
  const id = from === undefined ? undefined : target.bank.slots[from]?.id;
  if (lock.locked || from === undefined || id === undefined) return;
  const gap = move.to.index;
  const swap = move.modifier === 'alt' && moving.length === 1;
  const outcome = swap ? swapSwatches(target, from, gap > from ? gap - 1 : gap) : moveSwatches(target, moving, gap);
  reportOutcome(outcome);
  if (outcome.ok) selection.setFocus(currentBank(target)?.slots.findIndex((slot) => slot.id === id) ?? gap);
};

export { moveInGrid };
