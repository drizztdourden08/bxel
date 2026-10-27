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
});

const tileset = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  name: z.string(),
  bankId: BANK_ID_SCHEMA,
  tileWidth: COUNT_SCHEMA,
  tileHeight: COUNT_SCHEMA,
  tiles: COUNT_SCHEMA,
});

const tilemap = z.strictObject({
  tilemapId: TILEMAP_ID_SCHEMA,
  name: z.string(),
  tilesetId: TILESET_ID_SCHEMA,
  columns: COUNT_SCHEMA,
  rows: COUNT_SCHEMA,
  layers: COUNT_SCHEMA,
});

const sheet = z.strictObject({
  sheetId: SHEET_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  entries: COUNT_SCHEMA,
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
    tilesets: z.array(tileset).describe('The tilesets. Read the tiles of one with list_map_layers.'),
    tilemaps: z.array(tilemap).describe('The tilemaps. Read the layers and cells of one with list_map_layers and read_map_cells.'),
  }),
});

export { getDocumentTool };
