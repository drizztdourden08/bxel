/* @layer core @kind constants */
import { z } from 'zod';
import { ANIMATION_ID_SCHEMA, SPRITE_ID_SCHEMA, TILESET_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA, RECT_SCHEMA } from '../schema/shapes.constants';

const shapeDetail = z.strictObject({
  kind: z.enum(['full', 'rect', 'polygon']),
  layer: z.string(),
  oneWay: z.boolean(),
  rect: RECT_SCHEMA.optional().describe('For a box: its position and size inside the tile.'),
  points: z.array(z.strictObject({ x: z.number().int(), y: z.number().int() })).optional().describe('For a shape: its points inside the tile.'),
});

const fieldValue = z.union([z.string(), z.number(), z.boolean()]);

const tileDetail = z.strictObject({
  key: z.number().int(),
  spriteId: SPRITE_ID_SCHEMA,
  name: z.string(),
  index: z.number().int().describe('The position of the tile in the tileset layout, counted along the rows from 0.'),
  uses: COUNT_SCHEMA.describe('How many map cells use the tile.'),
  shapes: z.array(shapeDetail),
  animation: z.strictObject({ animationId: ANIMATION_ID_SCHEMA, tagId: z.string().nullable(), start: z.enum(['together', 'random']) }).nullable(),
  type: z.string().nullable(),
  probability: z.number(),
  turns: z.enum(['none', 'flips', 'all']),
  data: z.record(z.string(), fieldValue),
});

const fieldDetail = z.strictObject({
  name: z.string(),
  kind: z.enum(['bool', 'int', 'number', 'text', 'choice', 'colour']),
  default: fieldValue,
  choices: z.array(z.string()).optional(),
});

const TILESET_DETAIL_SCHEMA = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  columns: COUNT_SCHEMA.describe('The width of the tile layout. Holes in the layout are slots with no tile.'),
  rows: COUNT_SCHEMA,
  collisionLayers: z.array(z.string()),
  fields: z.array(fieldDetail).describe('The custom data fields of the tileset. Define them with tileset.fields, set values with tile.data.'),
  terrainSets: z
    .array(
      z.strictObject({
        id: z.string(),
        name: z.string(),
        kind: z.enum(['blob16', 'blob47', 'corner16']),
        slots: z
          .array(z.array(z.strictObject({ key: z.number().int(), weight: z.number(), flipX: z.boolean().optional(), flipY: z.boolean().optional(), diagonal: z.boolean().optional() })))
          .describe('One list of variants per slot, in slot order. An empty list is a missing slot. Set them with tileset.terrain_sets and paint with map.terrain (option set).'),
        missing: z.array(z.number().int()).describe('The slot numbers, counted from 0, that hold no tile.'),
      }),
    )
    .describe('The terrain sets. A tileset from an older file shows its single terrain rule set here as one set.'),
  tiles: z.array(tileDetail),
});

export { TILESET_DETAIL_SCHEMA };
