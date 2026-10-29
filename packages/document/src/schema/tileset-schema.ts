/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { AnimationId, BankId, SpriteId, TagId, TileId, TilesetId } from '../model/ids.type';
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '../model/limits.constants';
import { DEFAULT_COLLISION_LAYER, MAX_COLLISION_LAYERS, MAX_LAYOUT_COLUMNS, MAX_TILE_FIELDS, MAX_TILE_PROBABILITY, MAX_TILE_SHAPES, MAX_TILESET_TILES } from '../model/tilemap-limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { tileFieldSchema, fieldValueSchema } from './tile-field-schema';
import { tileShapeSchema } from './tile-shape-schema';
import { createdSchema } from './created-schema';
import { terrainSchema } from './terrain-schema';
import { terrainSetSchema } from './terrain-set-schema';
import { nameSchema } from './name-schema';
import { MAX_TILE_KEY } from './tileset-schema.constants';

const sizeSchema = z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE);

const tilePlaySchema = z.object({
  animationId: brandedIdSchema<AnimationId>(ID_PREFIX.animation),
  tagId: brandedIdSchema<TagId>(ID_PREFIX.tag).nullable(),
  start: z.enum(['together', 'random']),
});

const legacyTile = (value: unknown): unknown => {
  if (typeof value !== 'object' || value === null || !('collision' in value)) return value;
  const { collision, ...rest } = value as Record<string, unknown>;
  if ('shapes' in rest || typeof collision !== 'object' || collision === null) return rest;
  return { ...rest, shapes: [{ layer: DEFAULT_COLLISION_LAYER, ...collision }] };
};

const tileSchema = z.preprocess(
  legacyTile,
  z.object({
    id: brandedIdSchema<TileId>(ID_PREFIX.tile),
    key: z.number().int().min(1).max(MAX_TILE_KEY),
    spriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite),
    shapes: z.array(tileShapeSchema).max(MAX_TILE_SHAPES).optional(),
    animation: tilePlaySchema.optional(),
    layout: z.number().int().min(0).max(MAX_TILESET_TILES * MAX_LAYOUT_COLUMNS).optional(),
    type: z.string().max(64).optional(),
    probability: z.number().min(0).max(MAX_TILE_PROBABILITY).optional(),
    turns: z.enum(['none', 'flips', 'all']).optional(),
    data: z.record(z.string(), fieldValueSchema).optional(),
  }),
);

const tilesetSchema = z.object({
  id: brandedIdSchema<TilesetId>(ID_PREFIX.tileset),
  name: nameSchema,
  created: createdSchema.optional(),
  bankId: brandedIdSchema<BankId>(ID_PREFIX.bank),
  tileWidth: sizeSchema,
  tileHeight: sizeSchema,
  nextKey: z.number().int().min(1),
  tiles: z.array(tileSchema),
  terrain: terrainSchema.optional(),
  terrainSets: z.array(terrainSetSchema).max(12).optional(),
  columns: z.number().int().min(1).max(MAX_LAYOUT_COLUMNS).optional(),
  fields: z.array(tileFieldSchema).max(MAX_TILE_FIELDS).optional(),
  collisionLayers: z.array(z.string().min(1).max(32)).max(MAX_COLLISION_LAYERS).optional(),
});

export { tilesetSchema };
