/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BankId, SpriteId, TileId, TilesetId } from '../model/ids.type';
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '../model/limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { collisionSchema } from './collision-schema';
import { createdSchema } from './created-schema';
import { terrainSchema } from './terrain-schema';
import { nameSchema } from './name-schema';
import { MAX_TILE_KEY } from './tileset-schema.constants';

const sizeSchema = z.number().int().min(MIN_SPRITE_SIZE).max(MAX_SPRITE_SIZE);

const tileSchema = z.object({
  id: brandedIdSchema<TileId>(ID_PREFIX.tile),
  key: z.number().int().min(1).max(MAX_TILE_KEY),
  spriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite),
  collision: collisionSchema.optional(),
});

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
});

export { tilesetSchema };
