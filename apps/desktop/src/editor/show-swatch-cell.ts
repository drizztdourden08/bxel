/* @layer renderer-app @kind logic */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';

const findCell = (index: number): HTMLElement | null => document.querySelector<HTMLElement>(`[data-swatch-index="${index}"]`);

const showSwatchCell = (handle: VirtualGridHandle | null, index: number, done: (cell: HTMLElement) => void): void => {
  if (handle === null) {
    const cell = findCell(index);
    cell?.scrollIntoView({ block: 'nearest' });
    if (cell) done(cell);
    return;
  }
  requestAnimationFrame(() => {
    handle.scrollToIndex(index);
    requestAnimationFrame(() => {
      const cell = findCell(index);
      if (cell) done(cell);
    });
  });
};

export { showSwatchCell };
