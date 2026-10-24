/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_TILE_KEY } from './tileset-schema.constants';

const tileRefSchema = z.union([
  z.number().int().min(1).max(MAX_TILE_KEY),
  z.strictObject({ ref: z.string().min(1) }),
]);

export { tileRefSchema };
