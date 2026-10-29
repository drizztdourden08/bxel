/* @layer renderer-app @kind logic */
import { PAGE_ROWS } from '../TilesetPanel.constants';

const gridStep = (key: string, index: number, columns: number, count: number): number | null => {
  const last = count - 1;
  const row = Math.floor(index / columns);
  const column = index % columns;
  if ((key === 'ArrowLeft' && column === 0) || (key === 'ArrowRight' && column === columns - 1)) return null;
  const moves: Record<string, number> = {
    ArrowLeft: index - 1,
    ArrowRight: index + 1,
    ArrowUp: index - columns,
    ArrowDown: index + columns,
    Home: row * columns,
    End: row * columns + columns - 1,
    PageUp: index - columns * PAGE_ROWS,
    PageDown: index + columns * PAGE_ROWS,
  };
  const next = moves[key];
  return next === undefined ? null : Math.max(0, Math.min(last, next));
};

export { gridStep };
