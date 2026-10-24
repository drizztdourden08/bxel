/* @layer core @kind constants */
import { MAX_BLOCK_CELLS } from '@bxel/document';
import { cellRectSchema } from '@bxel/document/schema';

const CELL_RECT_SCHEMA = cellRectSchema
  .refine((rect) => rect.width * rect.height <= MAX_BLOCK_CELLS, {
    message: `width * height must be at most ${MAX_BLOCK_CELLS} cells.`,
  })
  .meta({ id: 'CellRect', description: 'A rectangle of map cells, not pixels: x and y count columns and rows.' });

export { CELL_RECT_SCHEMA };
