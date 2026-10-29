/* @layer core @kind constants */
import { z } from 'zod';
import { CELL_RECT_SCHEMA } from '../schema/cell-rect.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';

const SELECTED_SCHEMA = z.strictObject({
  count: COUNT_SCHEMA,
  bounds: CELL_RECT_SCHEMA.nullable(),
  cells: z.array(z.tuple([COUNT_SCHEMA, COUNT_SCHEMA, COUNT_SCHEMA, z.number().int().min(0).max(7)])).max(4096).describe('Each cell as [x, y, key, flags], row by row.'),
  truncated: z.boolean().describe('True when more than 4096 cells matched and cells holds the first 4096.'),
});

export { SELECTED_SCHEMA };
