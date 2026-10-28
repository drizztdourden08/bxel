/* @layer renderer-app @kind logic */
import { PANEL_TEXT } from '../../../palette-panel/palette-panel.constants';
import type { PanelModel } from '../PalettePanel.type';

const addReason = (panel: PanelModel): string => {
  const { bank } = panel.target;
  if (panel.lock.locked) return panel.lock.reason;
  return bank.slots.length >= bank.cap ? PANEL_TEXT.full(bank.cap) : '';
};

export { addReason };
