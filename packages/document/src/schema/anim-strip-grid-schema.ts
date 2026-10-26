/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const cells = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const animStripGridSchema = z.union([
  z.strictObject({ columns: cells, rows: cells }),
  z.strictObject({ cellWidth: cells, cellHeight: cells }),
]);

export { animStripGridSchema };
