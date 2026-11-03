/* @layer renderer-app @kind logic */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import { SWATCH_SELECTOR } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';

const revealNewSwatch = (panel: PanelModel, grid: RefObject<VirtualGridHandle | null>, index: number): void => {
  requestAnimationFrame(() => {
    grid.current?.scrollToIndex(index);
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`${SWATCH_SELECTOR}[data-swatch-index="${index}"]`);
      if (!element) return;
      element.focus();
      panel.selection.setFocus(index);
      panel.editor.open(index, element);
    });
  });
};

export { revealNewSwatch };
