/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const getHistoryTool = defineTool(TOOL_NAME.getHistory, {
  title: 'Get the history',
  description:
    'The undo history of a document, oldest first: label, who made each entry (the owner or a program). cursor is the number of entries applied; entries after it can be redone with undo direction "redo".',
  input: z.strictObject({ documentId: DOCUMENT_ID_SCHEMA, limit: z.number().int().min(1).max(200).default(50) }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    entries: z.array(
      z.strictObject({
        index: COUNT_SCHEMA,
        label: z.string(),
        actor: z.string().describe('owner, or the name of the program.'),
        origin: z.enum(['ui', 'mcp']),
        applied: z.boolean().describe('False for an entry that was undone and can be redone.'),
      }),
    ),
    cursor: COUNT_SCHEMA,
    total: COUNT_SCHEMA,
    canUndo: z.boolean(),
    canRedo: z.boolean(),
  }),
});

export { getHistoryTool };
