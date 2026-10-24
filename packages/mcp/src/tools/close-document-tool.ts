/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const closeDocumentTool = defineTool(TOOL_NAME.closeDocument, {
  title: 'Close a document',
  description:
    "Closes a document's tab. A clean document closes in either mode. An unsaved one is refused unless discard is true, which needs edit mode.",
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    discard: z.boolean().default(false),
  }),
  output: withFailure({ closed: z.boolean(), discarded: z.boolean() }),
});

export { closeDocumentTool };
