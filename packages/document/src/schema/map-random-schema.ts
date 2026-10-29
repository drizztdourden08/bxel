/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_RANDOM_TILES } from './map-random-schema.constants';
import { tileRefSchema } from './tile-ref-schema';

const mapRandomSchema = z.strictObject({
  tiles: z.array(tileRefSchema).min(1).max(MAX_RANDOM_TILES),
  seed: z.number().int().min(0).max(4294967295),
});

export { mapRandomSchema };
