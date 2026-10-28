/* @layer renderer-app @kind logic */
import type { MouseEvent } from 'react';
import { swatchSlot } from '../../../editor/swatch-slot';
import { useToolStore } from '../../../stores/useToolStore';
import type { PanelModel } from '../PalettePanel.type';

const swatchClick = (panel: PanelModel, index: number, event: MouseEvent<HTMLElement>, right: boolean): void => {
  const ctrl = event.ctrlKey || event.metaKey;
  if (!right && ctrl) {
    panel.selection.pick(index, event.shiftKey ? 'extend' : 'toggle');
    return;
  }
  useToolStore.getState().setColour(swatchSlot({ right, shift: event.shiftKey }), index);
  if (right || event.shiftKey) panel.selection.setFocus(index);
  else panel.selection.pick(index, 'only');
};

export { swatchClick };
