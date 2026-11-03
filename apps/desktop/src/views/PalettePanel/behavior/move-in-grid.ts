/* @layer renderer-app @kind logic */
import type { VirtualGridMove } from '@drizztdourden08/tessera';
import { currentBank } from '../../../palette-panel/current-bank';
import type { PanelModel } from '../PalettePanel.type';
import { gridOutcome } from './grid-outcome';
import { movingIndices } from './moving-indices';
import { reportOutcome } from './report-outcome';

const moveInGrid = (panel: PanelModel, move: VirtualGridMove): void => {
  const { target, selection, lock } = panel;
  const moving = movingIndices(target, move);
  const from = moving[0];
  const id = from === undefined ? undefined : target.bank.slots[from]?.id;
  if (lock.locked || from === undefined || id === undefined) return;
  const outcome = gridOutcome(target, moving, from, move);
  reportOutcome(outcome);
  if (outcome.ok) selection.setFocus(currentBank(target)?.slots.findIndex((slot) => slot.id === id) ?? move.to.index);
};

export { moveInGrid };
