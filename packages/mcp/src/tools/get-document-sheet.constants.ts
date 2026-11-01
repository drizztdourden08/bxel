/* @layer core @kind constants */
import { z } from 'zod';
import { PRESET_ID_SCHEMA, SHEET_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA, RECT_SCHEMA } from '../schema/shapes.constants';
import { GUIDES_SCHEMA } from './get-document-tool.constants';

const sheetEntry = z.strictObject({
  kind: z.enum(['sprite', 'animation']),
  id: z.string().describe('The spriteId or animationId of the entry.'),
  name: z.string(),
  folder: z.string().describe('The folder part of the name, empty when the name has no slash.'),
  at: z.strictObject({ x: z.number().int(), y: z.number().int() }).describe('Where the entry sits on the sheet, in pixels.'),
  source: RECT_SCHEMA.nullable().describe('The part of the sprite that is shown, or null for all of it.'),
  tagId: z.string().nullable().describe('The tag of an animation entry, or null for the whole animation.'),
  usedBy: z
    .array(z.strictObject({ kind: z.enum(['animation', 'tileset', 'sheet']), id: z.string(), name: z.string() }))
    .describe('A sprite entry: the animations, tilesets and other sheets that use the sprite. Empty for an animation entry.'),
});

const sheetPage = z.strictObject({
  index: z.number().int().min(0).describe('The atlas page the owner has on screen.'),
  count: COUNT_SCHEMA,
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  empty: z.number().min(0).max(1).describe('The share of the page that holds no pixels.'),
  failure: z.string().nullable().describe('Why the sheet cannot be packed, or null.'),
});

const sheetExport = z.strictObject({
  layout: z.enum(['grid', 'packed']),
  columns: COUNT_SCHEMA,
  maxWidth: COUNT_SCHEMA,
  padding: z.number().int(),
  margin: z.number().int(),
  extrusion: z.number().int(),
  trim: z.boolean(),
  powerOfTwo: z.boolean(),
  rotate: z.boolean(),
  pageSide: COUNT_SCHEMA,
  presets: z.array(z.strictObject({ presetId: PRESET_ID_SCHEMA, name: z.string(), format: z.string() })).describe('The export presets that write this sheet.'),
});

const sheetLayout = z.strictObject({
  kind: z.enum(['manual', 'grid', 'packed']),
  columns: COUNT_SCHEMA.optional(),
  maxWidth: COUNT_SCHEMA.optional(),
  spacing: z.number().int(),
  margin: z.number().int(),
});

const SHEET_SCHEMA = z.strictObject({
  sheetId: SHEET_ID_SCHEMA,
  name: z.string(),
  width: COUNT_SCHEMA,
  height: COUNT_SCHEMA,
  entries: COUNT_SCHEMA,
  layout: sheetLayout.optional().describe('Given with include entries.'),
  page: sheetPage.optional().describe('The atlas page on screen and how many pages the sheet packs into. Given with include entries.'),
  export: sheetExport.optional().describe('How the sheet exports as an atlas: layout, spacing, extrusion, trim, rotation, page side and the presets that write it. Given with include entries.'),
  entryList: z.array(sheetEntry).optional().describe('The sprites and animations of the sheet in sheet order, with their places. Given with include entries.'),
  guides: GUIDES_SCHEMA.optional().describe('Only with include guides.'),
});

export { SHEET_SCHEMA };
