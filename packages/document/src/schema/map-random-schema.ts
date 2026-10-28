/* @layer core @kind logic */
import { z } from 'zod';
import { tileRefSchema } from './tile-ref-schema';

const MAX_RANDOM_TILES = 64;

const mapRandomSchema = z.strictObject({
  tiles: z.array(tileRefSchema).min(1).max(MAX_RANDOM_TILES),
  seed: z.number().int().min(0).max(4294967295),
});

export { mapRandomSchema };
