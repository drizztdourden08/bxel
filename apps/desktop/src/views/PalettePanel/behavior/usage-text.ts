/* @layer renderer-app @kind logic */
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';

const usageText = (panel: PanelModel, index: number): string => {
  const use = panel.usage?.slots[index];
  return use ? PALETTE_PANEL_TEXT.pixelsLine(use.pixels, use.frames) : '';
};

export { usageText };
