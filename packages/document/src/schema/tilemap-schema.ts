/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { MapLayerId, TilemapId, TilesetId } from '../model/ids.type';
import { assetGuidesSchema } from './asset-guides-schema';
import { brandedIdSchema } from './branded-id-schema';
import { createdSchema } from './created-schema';
import { nameSchema } from './name-schema';
import { orientationSchema } from './orientation-schema';
import { tagColourSchema } from './tag-colour-schema';
import { MAP_LAYER_KINDS } from '../model/layer-lock.constants';
import { opacitySchema } from './opacity-schema';
import { MAX_MAP_SIDE } from './tilemap-schema.constants';

const sideSchema = z.number().int().min(1).max(MAX_MAP_SIDE);

const mapLayerId = brandedIdSchema<MapLayerId>(ID_PREFIX.mapLayer);

const mapLayerSchema = z.object({
  id: mapLayerId,
  name: nameSchema,
  visible: z.boolean(),
  locked: z.boolean(),
  kind: z.enum(MAP_LAYER_KINDS).optional(),
  parentId: mapLayerId.optional(),
  opacity: opacitySchema.optional(),
  colour: tagColourSchema.optional(),
});

const tilemapShellSchema = z.object({
  id: brandedIdSchema<TilemapId>(ID_PREFIX.tilemap),
  name: nameSchema,
  created: createdSchema.optional(),
  tilesetId: brandedIdSchema<TilesetId>(ID_PREFIX.tileset),
  columns: sideSchema,
  rows: sideSchema,
  layers: z.array(mapLayerSchema),
  orientation: orientationSchema.optional(),
  guides: assetGuidesSchema.optional(),
});

export { tilemapShellSchema };
