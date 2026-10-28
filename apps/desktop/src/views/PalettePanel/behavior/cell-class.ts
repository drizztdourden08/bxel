/* @layer renderer-app @kind logic */
import type { CellLook } from '../PalettePanel.type';

const cellClass = (look: CellLook): string =>
  [
    'grid-cell',
    look.selected && 'grid-cell--selected',
    look.hinted && 'grid-cell--hinted',
    look.unused && 'grid-cell--unused',
    look.dragging && 'grid-cell--dragging',
    look.drop && `grid-cell--drop-${look.drop}`,
  ]
    .filter(Boolean)
    .join(' ');

export { cellClass };
