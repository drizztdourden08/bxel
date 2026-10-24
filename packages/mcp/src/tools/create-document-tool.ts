/* @layer core @kind logic */
import { artworkCreateSchema } from '@bxel/document/schema';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const createDocumentTool = defineTool(TOOL_NAME.createDocument, {
  title: 'Create a document',
  description:
    'Creates a new artwork with one palette bank and, optionally, one sprite. It opens as an untitled tab; save_document then gives it a place.',
  input: artworkCreateSchema,
  output: withFailure({ documentId: DOCUMENT_ID_SCHEMA, revision: REVISION_SCHEMA }),
});

export { createDocumentTool };
