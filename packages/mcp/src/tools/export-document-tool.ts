/* @layer core @kind logic */
import { z } from 'zod';
import {
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
} from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA, FILE_NAME_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { EXPORT_FORMAT_VALUES } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const base = z.strictObject({
  documentId: DOCUMENT_ID_SCHEMA,
  expectedRevision: REVISION_SCHEMA.optional(),
  format: z.enum(EXPORT_FORMAT_VALUES),
  source: z.union([
    z.strictObject({ spriteId: SPRITE_ID_SCHEMA, frameId: FRAME_ID_SCHEMA.optional() }),
    z.strictObject({ sheetId: SHEET_ID_SCHEMA }),
  ]),
  scale: z.number().int().min(1).max(16).default(1),
  overwrite: z.boolean().default(false),
});

const exportDocumentTool = defineTool(TOOL_NAME.exportDocument, {
  title: 'Export a document',
  description:
    'Exports one sprite frame or one sheet at a frozen revision, into a project granted editing or the assistant folder. Give exactly one of location and fileName. Exports stay off the recent files list.',
  input: z.xor([
    base.extend({ location: LOCATION_SCHEMA.describe('A project path granted editing.') }),
    base.extend({ fileName: FILE_NAME_SCHEMA.describe('Lands in the assistant folder.') }),
  ]),
  output: withFailure({
    revision: REVISION_SCHEMA,
    files: z.array(z.strictObject({ fileName: z.string(), bytes: COUNT_SCHEMA, sha256: SHA256_SCHEMA })),
    indexHash: SHA256_SCHEMA,
  }),
});

export { exportDocumentTool };
