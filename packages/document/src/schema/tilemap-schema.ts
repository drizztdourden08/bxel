/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { MapLayerId, TilemapId, TilesetId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';
import { MAX_MAP_SIDE } from './tilemap-schema.constants';

const sideSchema = z.number().int().min(1).max(MAX_MAP_SIDE);

const mapLayerSchema = z.object({
  id: brandedIdSchema<MapLayerId>(ID_PREFIX.mapLayer),
  name: nameSchema,
  visible: z.boolean(),
  locked: z.boolean(),
});

const tilemapShellSchema = z.object({
  id: brandedIdSchema<TilemapId>(ID_PREFIX.tilemap),
  name: nameSchema,
  tilesetId: brandedIdSchema<TilesetId>(ID_PREFIX.tileset),
  columns: sideSchema,
  rows: sideSchema,
  layers: z.array(mapLayerSchema),
});

export { tilemapShellSchema };
