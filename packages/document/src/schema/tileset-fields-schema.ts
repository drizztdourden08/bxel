/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_COLLISION_LAYERS, MAX_TILE_FIELDS } from '../model/tilemap-limits.constants';
import { tileFieldSchema } from './tile-field-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tilesetFieldsSchema = z.strictObject({
  tileset: tilesetRefSchema,
  fields: z.array(tileFieldSchema).max(MAX_TILE_FIELDS).optional(),
  collisionLayers: z.array(z.string().min(1).max(32)).min(1).max(MAX_COLLISION_LAYERS).optional(),
});

export { tilesetFieldsSchema };
