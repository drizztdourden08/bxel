/* @layer renderer-app @kind logic */
import { PAGE_ROWS } from '../PalettePanel.constants';

const focusStep = (key: string, index: number, total: number, columns: number): number | undefined => {
  const moves: Readonly<Record<string, number>> = {
    ArrowLeft: index - 1,
    ArrowRight: index + 1,
    ArrowUp: index - columns,
    ArrowDown: index + columns,
    Home: 0,
    End: total - 1,
    PageUp: index - columns * PAGE_ROWS,
    PageDown: index + columns * PAGE_ROWS,
  };
  const next = moves[key];
  if (next === undefined) return undefined;
  return Math.max(0, Math.min(total - 1, next));
};

export { focusStep };
