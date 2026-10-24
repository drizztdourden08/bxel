/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA, PLACE_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA, FILE_NAME_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const toLocation = z.strictObject({
  location: LOCATION_SCHEMA.describe('Ends in .bxel; in a project granted editing.'),
  overwrite: z.boolean().default(false),
});

const toAssistantFolder = z.strictObject({
  fileName: FILE_NAME_SCHEMA.describe('Ends in .bxel; lands in the assistant folder.'),
  overwrite: z.boolean().default(false),
});

const saveDocumentTool = defineTool(TOOL_NAME.saveDocument, {
  title: 'Save a document',
  description:
    'Runs the save job. "current" writes the exact file the document came from, when the write setting allows it. A new place (a project path, or a file name in the assistant folder) works like Save As. An untitled document needs a new place.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    expectedRevision: REVISION_SCHEMA.optional(),
    target: z.union([z.literal('current'), toLocation, toAssistantFolder]),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    fileName: z.string(),
    place: PLACE_SCHEMA,
    bytes: COUNT_SCHEMA,
    savedAt: TIMESTAMP_SCHEMA,
  }),
});

export { saveDocumentTool };
