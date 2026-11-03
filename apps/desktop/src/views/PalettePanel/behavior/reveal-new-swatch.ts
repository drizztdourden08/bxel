/* @layer renderer-app @kind logic */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import { showSwatchCell } from '../../../editor/show-swatch-cell';
import type { PanelModel } from '../PalettePanel.type';

const revealNewSwatch = (panel: PanelModel, grid: RefObject<VirtualGridHandle | null>, index: number): void => {
  showSwatchCell(grid.current, index, (cell) => {
    cell.focus();
    panel.selection.setFocus(index);
    panel.editor.open(index, cell);
  });
};

export { revealNewSwatch };
