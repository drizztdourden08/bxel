/* @layer core @kind logic */
import { z } from 'zod';
import { terrainSchema } from './terrain-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetTerrainSchema = z.strictObject({
  tileset: tilesetRefSchema,
  rules: terrainSchema.nullable(),
});

export { tilesetTerrainSchema };
