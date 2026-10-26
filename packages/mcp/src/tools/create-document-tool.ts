/* @layer core @kind logic */
import { artworkCreateSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { ASSET_KIND_SCHEMA, ASSET_REF_SCHEMA } from '../schema/assets.constants';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const createDocumentTool = defineTool(TOOL_NAME.createDocument, {
  title: 'Create a document',
  description:
    'Creates a new workspace with one new asset of the given kind (default sprite) and the palette it needs. sprite makes a sprite and a palette; palette makes only a palette; animation makes an animation of empty frames; sheet makes a sprite and a sheet that holds it; tileset makes a tileset; tilemap makes a tileset and a map on it. It opens as an untitled tab; save_document then gives it a place, as .bxsprite, .bxanim, .bxsheet, .bxpalette, .bxtiles or .bxmap.',
  input: artworkCreateSchema.extend({
    kind: ASSET_KIND_SCHEMA.default('sprite'),
    tileSize: z.strictObject({ width: z.number().int().min(1).max(256), height: z.number().int().min(1).max(256) }).optional().describe('Tile width and height for a tileset or tilemap. Default 16 by 16.'),
    animation: z.strictObject({ width: z.number().int().min(1).max(256), height: z.number().int().min(1).max(256), frames: z.number().int().min(1).max(256).default(1) }).optional().describe('Canvas size and the number of empty frames of an animation. Default 16 by 16, one frame.'),
    mapSize: z.strictObject({ columns: z.number().int().min(1).max(512), rows: z.number().int().min(1).max(512) }).optional().describe('Columns and rows for a tilemap. Default 16 by 16.'),
  }),
  output: withFailure({ documentId: DOCUMENT_ID_SCHEMA, revision: REVISION_SCHEMA, asset: ASSET_REF_SCHEMA.nullable() }),
});

export { createDocumentTool };
