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
    'Undoes the newest history entry, only when this session made it. Otherwise it fails with UNDO_NOT_OWN. Redo is not offered; the owner redoes in Bxel.',
  input: z.strictObject({ documentId: DOCUMENT_ID_SCHEMA, expectedRevision: REVISION_SCHEMA }),
  output: withFailure({
    baseRevision: REVISION_SCHEMA,
    revision: REVISION_SCHEMA,
    undone: z.strictObject({ label: z.string(), origin: z.enum(['ui', 'mcp']) }),
    changes: CHANGE_SET_SCHEMA,
  }),
});

export { undoTool };
