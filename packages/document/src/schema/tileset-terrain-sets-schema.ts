/* @layer core @kind logic */
import { z } from 'zod';
import { terrainSetSchema } from './terrain-set-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetTerrainSetsSchema = z.strictObject({
  tileset: tilesetRefSchema,
  sets: z.array(terrainSetSchema).max(12).nullable(),
});

export { tilesetTerrainSetsSchema };
