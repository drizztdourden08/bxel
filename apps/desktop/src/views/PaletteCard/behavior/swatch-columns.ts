/* @layer renderer-app @kind logic */
import { MAX_SWATCH_COLUMNS, MIN_EVEN_COLUMNS } from '../PaletteCard.constants';

const swatchColumns = (count: number): number => {
  for (let columns = Math.min(count, MAX_SWATCH_COLUMNS); columns >= MIN_EVEN_COLUMNS; columns -= 1) {
    if (count % columns === 0) return columns;
  }
  return Math.min(count, MAX_SWATCH_COLUMNS);
};

export { swatchColumns };
