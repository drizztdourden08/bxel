/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { PANEL_TEXT } from '../../../palette-panel/palette-panel.constants';
import { paletteUsage } from '../../../palette-panel/palette-usage';
import { usePaletteSelectionStore } from '../../../stores/usePaletteSelectionStore';
import type { PanelModel } from '../PalettePanel.type';

const selectUnused = (panel: PanelModel): void => {
  const { artwork, target } = panel;
  const { unused } = paletteUsage(artwork, target.bank, target.sprite, 'palette');
  const ids = unused.flatMap((index) => (target.bank.slots[index] ? [String(target.bank.slots[index].id)] : []));
  usePaletteSelectionStore.getState().select({ bankId: target.bank.id, selected: ids, anchor: ids[0] ?? null });
  announce(ids.length === 0 ? PANEL_TEXT.nothingUnused : `${ids.length} unused swatches selected.`);
};

export { selectUnused };
