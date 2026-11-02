/* @layer core @kind logic */
import { z } from 'zod';
import { terrainSetSchema } from './terrain-set-schema';
import { tilesetRefSchema } from './tileset-ref-schema';
import { tilesetTerrainFillSchema } from './tileset-terrain-fill-schema';

const tilesetTerrainSetsSchema = z.strictObject({
  tileset: tilesetRefSchema,
  sets: z.array(terrainSetSchema).max(12).nullable().optional(),
  fill: tilesetTerrainFillSchema.optional().describe('Fills the slots of one set from a block of the tile layout in a known packing, after sets are written.'),
});

export { tilesetTerrainSetsSchema };
