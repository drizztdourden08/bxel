/* @layer core @kind logic */
import { z } from 'zod';
import { SPRITES_PAGE_DEFAULT, SPRITES_PAGE_MAX } from '../limits/limits.constants';
import {
  ANIMATION_ID_SCHEMA,
  BANK_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  LAYER_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SLICE_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
  TILEMAP_ID_SCHEMA,
  TILESET_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA, RECT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { SYMMETRY_REPLY_SCHEMA } from './get-document-tool.constants';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const bank = z.strictObject({
  bankId: BANK_ID_SCHEMA,
  name: z.string(),
  cap: COUNT_SCHEMA,
  used: COUNT_SCHEMA,
  transparent: z.boolean(),
});

const tag = z.strictObject({
  name: z.string(),
  from: COUNT_SCHEMA,
  to: COUNT_SCHEMA,
  colour: HEX_COLOR_SCHEMA.optional().describe('The colour the owner gave the tag, as #rrggbb. Left out when the tag has none.'),
});

const pivot = z.strictObject({ x2: z.number().int(), y2: z.number().int() });

const slice = z.strictObject({
  sliceId: SLICE_ID_SCHEMA,
  name: z.string(),
  rect: RECT_SCHEMA,
  pivot: pivot.nullable().describe('Half pixels from the slice corner, inside the slice. Null when the slice has none.'),
  center: z.strictObject({ x: z.number().int(), y: z.number().int(), width: COUNT_SCHEMA, height: COUNT_SCHEMA }).nullable().describe('The 9-slice center, inside the slice.'),
});

const guides = z.strictObject({
  x: z.array(z.number().int()),
  y: z.array(z.number().int()),
});

const sprite = z.strictObject({
  spriteId: SPRITE_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  bankId: BANK_ID_SCHEMA,
  pivot,
  layers: z.array(
    z.strictObject({ layerId: LAYER_ID_SCHEMA, name: z.string(), visible: z.boolean(), locked: z.boolean() }),
  ),
  frames: z.array(z.strictObject({ frameId: FRAME_ID_SCHEMA, durationMs: COUNT_SCHEMA })),
  tags: z.array(tag),
  slices: z.array(slice).describe('The slices of the sprite. Edit them with the slice.* steps.'),
  guides: guides.describe('The guide lines of the sprite, as pixel positions: x are vertical lines, y are horizontal lines.'),
  symmetry: SYMMETRY_REPLY_SCHEMA.nullable().describe('The mirror state saved with the sprite: x and y are the mirror axes, axisX and axisY the doubled pixel coordinate of each (null is the centre). Null when the sprite has none. Change it with the sprite.symmetry step.'),
});

const tileset = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  name: z.string(),
  bankId: BANK_ID_SCHEMA,
  tileWidth: COUNT_SCHEMA,
  tileHeight: COUNT_SCHEMA,
  tiles: COUNT_SCHEMA,
});

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

const tilesetDetail = z.strictObject({
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

const tilemap = z.strictObject({
  tilemapId: TILEMAP_ID_SCHEMA,
  name: z.string(),
  tilesetId: TILESET_ID_SCHEMA,
  columns: COUNT_SCHEMA,
  rows: COUNT_SCHEMA,
  layers: COUNT_SCHEMA,
});

const sheetEntry = z.strictObject({
  kind: z.enum(['sprite', 'animation']),
  id: z.string().describe('The spriteId or animationId of the entry.'),
  name: z.string(),
  folder: z.string().describe('The folder part of the name, empty when the name has no slash.'),
  at: z.strictObject({ x: z.number().int(), y: z.number().int() }).describe('Where the entry sits on the sheet, in pixels.'),
  source: RECT_SCHEMA.nullable().describe('The part of the sprite that is shown, or null for all of it.'),
  tagId: z.string().nullable().describe('The tag of an animation entry, or null for the whole animation.'),
});

const sheetLayout = z.strictObject({
  kind: z.enum(['manual', 'grid', 'packed']),
  columns: COUNT_SCHEMA.optional(),
  maxWidth: COUNT_SCHEMA.optional(),
  spacing: z.number().int(),
  margin: z.number().int(),
});

const sheet = z.strictObject({
  sheetId: SHEET_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  entries: COUNT_SCHEMA,
  layout: sheetLayout.optional().describe('Given with include entries.'),
  entryList: z.array(sheetEntry).optional().describe('The sprites and animations of the sheet in sheet order, with their places. Given with include entries.'),
});

const brush = z.strictObject({
  brushId: z.string(),
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
});

const animation = z.strictObject({
  animationId: ANIMATION_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  frames: COUNT_SCHEMA,
  tags: COUNT_SCHEMA,
});

const getDocumentTool = defineTool(TOOL_NAME.getDocument, {
  title: 'Get a document',
  description:
    'The structure to read before editing: banks, sprites with their layers, frames, tags, slices and guides, animations, sheets, tilesets and tilemaps. Sprites page by 128, up to 512 a call.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    spriteOffset: z.number().int().min(0).default(0),
    spriteLimit: z.number().int().min(1).max(SPRITES_PAGE_MAX).default(SPRITES_PAGE_DEFAULT),
    include: z
      .array(z.enum(['entries', 'tileset']))
      .default([])
      .describe(
        'Add detail. entries lists the sprites and animations of each sheet with their places and the layout. tileset lists every tile with its layout position, uses, collision shapes, animation, probability, turns and data, plus the fields and collision layers; it works with no tilemap.',
      ),
  }),
  output: withFailure({
    documentId: DOCUMENT_ID_SCHEMA,
    revision: REVISION_SCHEMA,
    name: z.string(),
    canUndo: z.boolean(),
    canRedo: z.boolean(),
    undoIsOwn: z.boolean(),
    banks: z.array(bank),
    sprites: z.array(sprite),
    spritesTotal: COUNT_SCHEMA,
    truncated: z.boolean(),
    animations: z.array(animation).describe('The animations. Read one with get_animation. The frame sprites an animation owns are not in sprites.'),
    sheets: z.array(sheet),
    brushes: z.array(brush).describe('The custom brushes saved in the artwork. Add them with brush.add and stamp them with pixels.stamp.'),
    tilesets: z.array(tileset).describe('The tilesets. Read the tiles of one with list_map_layers.'),
    tilemaps: z.array(tilemap).describe('The tilemaps. Read the layers and cells of one with list_map_layers and read_map_cells.'),
    tilesetDetails: z.array(tilesetDetail).optional().describe('The detail of each tileset. Only present when include has tileset.'),
  }),
});

export { getDocumentTool };
