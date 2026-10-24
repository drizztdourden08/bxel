/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { FILE_REF_SCHEMA } from '../schema/place.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const openFileTool = defineTool(TOOL_NAME.openFile, {
  title: 'Open a file',
  description:
    'Opens a .bxel file into Bxel as a new tab and returns the document. A file that is already open returns its existing document. A damaged but recoverable file opens read only.',
  input: z.strictObject({
    file: FILE_REF_SCHEMA,
    activate: z.boolean().default(false).describe("Make it the active tab. Off by default so the owner's view does not jump."),
  }),
  output: withFailure({
    documentId: DOCUMENT_ID_SCHEMA,
    revision: REVISION_SCHEMA,
    alreadyOpen: z.boolean(),
    readOnly: z.boolean(),
    outcome: z.enum(['ok', 'recoverable']),
    fileName: z.string(),
  }),
});

export { openFileTool };
