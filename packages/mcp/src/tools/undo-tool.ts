/* @layer core @kind logic */
import { z } from 'zod';
import { CHANGE_SET_SCHEMA } from '../schema/changes.constants';
import { DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const undoTool = defineTool(TOOL_NAME.undo, {
  title: 'Undo',
  description:
    'Undoes the newest history entry, only when this session made it. Otherwise it fails with UNDO_NOT_OWN. With direction "redo" it redoes the entry that was undone, again only when this session made it. steps repeats it; one refused step stops the run and what was done stays done. get_history shows the entries.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    expectedRevision: REVISION_SCHEMA,
    direction: z.enum(['undo', 'redo']).default('undo'),
    steps: z.number().int().min(1).max(50).default(1),
  }),
  output: withFailure({
    baseRevision: REVISION_SCHEMA,
    revision: REVISION_SCHEMA,
    direction: z.enum(['undo', 'redo']),
    count: z.number().int().min(1),
    undone: z.strictObject({ label: z.string(), origin: z.enum(['ui', 'mcp']) }).describe('The last entry that was undone or redone.'),
    changes: CHANGE_SET_SCHEMA,
  }),
});

export { undoTool };
