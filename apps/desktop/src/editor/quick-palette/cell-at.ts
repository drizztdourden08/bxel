/* @layer renderer-app @kind logic */
import { QUICK_CELL_SELECTOR } from './quick-palette.constants';
import type { QuickPoint } from './quick-palette.type';

const cellAt = (point: QuickPoint): HTMLElement | null => {
  const under = document.elementFromPoint(point.x, point.y);
  const cell = under?.closest<HTMLElement>(QUICK_CELL_SELECTOR);
  return cell ?? null;
};

export { cellAt };
