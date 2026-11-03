/* @layer renderer-app @kind logic */
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { useSwatchGridStore } from '../stores/useSwatchGridStore';
import { showSwatchCell } from './show-swatch-cell';
import { swatchRef } from './swatch-ref';

const revealSwatch = (args: Partial<SwatchArgs>): void => {
  const index = swatchRef(args);
  if (index === null) return;
  showSwatchCell(useSwatchGridStore.getState().handle, index, (cell) => cell.focus());
};

export { revealSwatch };
