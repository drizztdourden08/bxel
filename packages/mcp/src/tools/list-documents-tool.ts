/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENTS_LISTED_MAX } from '../limits/limits.constants';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { PLACE_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { NO_INPUT_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const listDocumentsTool = defineTool(TOOL_NAME.listDocuments, {
  title: 'List documents',
  description: 'The documents open in Bxel that this session may see, at most 64, each with its place.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({
    documents: z
      .array(
        z.strictObject({
          documentId: DOCUMENT_ID_SCHEMA,
          name: z.string(),
          fileName: z.string().nullable(),
          place: PLACE_SCHEMA,
          revision: REVISION_SCHEMA,
          dirty: z.boolean(),
          readOnly: z.boolean(),
          active: z.boolean(),
          openedBy: z.enum(['owner', 'mcp']),
          sprites: COUNT_SCHEMA,
          sheets: COUNT_SCHEMA,
        }),
      )
      .max(DOCUMENTS_LISTED_MAX),
  }),
});

export { listDocumentsTool };
