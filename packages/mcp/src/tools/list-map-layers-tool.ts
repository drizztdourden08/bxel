/* @layer core @kind logic */
import { z } from 'zod';
import { ANIMATION_ID_SCHEMA, DOCUMENT_ID_SCHEMA, TAG_ID_SCHEMA, MAP_LAYER_ID_SCHEMA, REVISION_SCHEMA, SPRITE_ID_SCHEMA, TILEMAP_ID_SCHEMA, TILESET_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const layer = z.strictObject({ layerId: MAP_LAYER_ID_SCHEMA, name: z.string(), visible: z.boolean(), locked: z.boolean() });

const tilemap = z.strictObject({
  tilemapId: TILEMAP_ID_SCHEMA,
  name: z.string(),
  tilesetId: TILESET_ID_SCHEMA,
  columns: COUNT_SCHEMA,
  rows: COUNT_SCHEMA,
  orientation: z.enum(['orthogonal', 'isometric', 'staggered', 'hexagonal']),
  layers: z.array(layer).describe('In drawing order, the first is at the bottom.'),
});

const tile = z.strictObject({
  key: COUNT_SCHEMA.describe('The number a map cell holds. 0 means an empty cell.'),
  spriteId: SPRITE_ID_SCHEMA,
  collision: z.enum(['full', 'rect', 'polygon']).nullable(),
  animation: z
    .strictObject({ animationId: ANIMATION_ID_SCHEMA, tagId: TAG_ID_SCHEMA.nullable(), start: z.enum(['together', 'random']) })
    .nullable()
    .describe('The animation the tile plays on a map, or null for a still tile. Set it with the tile.animation step.'),
});

const tileset = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  name: z.string(),
  tileWidth: COUNT_SCHEMA,
  tileHeight: COUNT_SCHEMA,
  tileCount: COUNT_SCHEMA,
  terrain: z.enum(['blob16', 'blob47']).nullable().describe('The autotile rule set of the tileset, or null.'),
  tiles: z.array(tile).describe('Only listed when includeTiles is true.'),
});

const listMapLayersTool = defineTool(TOOL_NAME.listMapLayers, {
  title: 'List tilemaps and their layers',
  description:
    'The tilemaps of a document with their size, orientation and layers, and the tileset each uses. Read this before read_map_cells. Edit cells with apply_edits: map.write (a rectangle of keys), map.paint, map.rect, map.fill, map.terrain and the other map.* commands.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    tilemapId: TILEMAP_ID_SCHEMA.optional().describe('Only this tilemap and its tileset.'),
    includeTiles: z.boolean().default(false).describe('List the tile keys of each tileset.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    tilemaps: z.array(tilemap),
    tilesets: z.array(tileset),
  }),
});

export { listMapLayersTool };
