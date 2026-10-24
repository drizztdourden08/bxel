/* @layer core @kind logic */
import { z } from 'zod';
import { SPRITES_PAGE_DEFAULT, SPRITES_PAGE_MAX } from '../limits/limits.constants';
import {
  BANK_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  LAYER_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA } from '../schema/shapes.constants';
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

const sprite = z.strictObject({
  spriteId: SPRITE_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  bankId: BANK_ID_SCHEMA,
  pivot: z.strictObject({ x2: z.number().int(), y2: z.number().int() }),
  layers: z.array(
    z.strictObject({ layerId: LAYER_ID_SCHEMA, name: z.string(), visible: z.boolean(), locked: z.boolean() }),
  ),
  frames: z.array(z.strictObject({ frameId: FRAME_ID_SCHEMA, durationMs: COUNT_SCHEMA })),
  tags: z.array(tag),
});

const sheet = z.strictObject({
  sheetId: SHEET_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  entries: COUNT_SCHEMA,
});

const getDocumentTool = defineTool(TOOL_NAME.getDocument, {
  title: 'Get a document',
  description:
    'The structure to read before editing: banks, sprites, layers, frames, tags and sheets. Sprites page by 128, up to 512 a call.',
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
    sheets: z.array(sheet),
  }),
});

export { getDocumentTool };
