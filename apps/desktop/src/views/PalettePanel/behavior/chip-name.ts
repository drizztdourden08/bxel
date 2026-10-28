/* @layer renderer-app @kind logic */
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';

const chipName = (position: number, index: number, label: string | undefined): string => {
  if (label !== undefined) return PALETTE_PANEL_TEXT.chip(position, label);
  return index >= 0 ? PALETTE_PANEL_TEXT.chipPast(position, index) : PALETTE_PANEL_TEXT.chipEmpty(position);
};

export { chipName };
