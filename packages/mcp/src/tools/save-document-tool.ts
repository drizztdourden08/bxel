/* @layer core @kind logic */
import { z } from 'zod';
import { ASSET_REF_SCHEMA } from '../schema/assets.constants';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA, PLACE_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA, FILE_NAME_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { MOVE_NOTE } from './save-document-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const toLocation = z.strictObject({
  location: LOCATION_SCHEMA.describe('Ends in the extension of the asset to save, such as .bxsprite; in a project granted editing.'),
  overwrite: z.boolean().default(false),
  moveAsset: z.boolean().default(false).describe(MOVE_NOTE),
});

const toAssistantFolder = z.strictObject({
  fileName: FILE_NAME_SCHEMA.describe('Ends in the extension of the asset to save, such as .bxsprite; lands in the assistant folder.'),
  overwrite: z.boolean().default(false),
  moveAsset: z.boolean().default(false).describe(MOVE_NOTE),
});

const saveDocumentTool = defineTool(TOOL_NAME.saveDocument, {
  title: 'Save a document',
  description:
    'Runs the save job. The document is a workspace of assets. "current" writes every asset with unsaved changes to its own file, when the write setting allows it; with asset it writes only that asset. A new place (a project path, or a file name in the assistant folder) saves one asset there: the asset named by asset, or else the one whose kind matches the extension (.bxsprite, .bxsheet, .bxpalette, .bxtiles, .bxmap). An asset with no file yet takes the new place as its file. An asset that already has a file gets a copy at the new place unless moveAsset is true.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    expectedRevision: REVISION_SCHEMA.optional(),
    asset: ASSET_REF_SCHEMA.optional().describe('Which asset of the workspace to save. Default: every dirty asset for "current", the asset matching the extension for a new place.'),
    target: z.union([z.literal('current'), toLocation, toAssistantFolder]),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    fileName: z.string(),
    place: PLACE_SCHEMA,
    bytes: COUNT_SCHEMA,
    savedAt: TIMESTAMP_SCHEMA,
    asset: ASSET_REF_SCHEMA.nullable().optional(),
  }),
});

export { saveDocumentTool };
