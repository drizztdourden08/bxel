/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA, RECENT_ID_SCHEMA } from '../schema/ids.constants';
import { REL_PATH_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { FILE_KIND_SCHEMA, NO_INPUT_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const folderPath = z.strictObject({ folderId: FOLDER_ID_SCHEMA, path: REL_PATH_SCHEMA });

const listPlacesTool = defineTool(TOOL_NAME.listPlaces, {
  title: 'List places',
  description:
    'Where the assistant can look: granted projects with their folders, the recent files and the assistant folder. Anything outside the "assistant can see" setting is left out.',
  input: NO_INPUT_SCHEMA,
  output: withFailure({
    projects: z.array(
      z.strictObject({
        projectId: PROJECT_ID_SCHEMA,
        name: z.string(),
        access: z.enum(['read', 'edit']),
        open: z.boolean(),
        folders: z.array(z.strictObject({ folderId: FOLDER_ID_SCHEMA, name: z.string() })),
        newFiles: folderPath.nullable(),
        exports: folderPath.nullable(),
      }),
    ),
    recent: z.array(
      z.strictObject({
        recentId: RECENT_ID_SCHEMA,
        fileName: z.string(),
        kind: FILE_KIND_SCHEMA,
        openedAt: TIMESTAMP_SCHEMA,
        documentId: DOCUMENT_ID_SCHEMA.nullable(),
      }),
    ),
    assistantFolder: z.strictObject({ name: z.string(), writable: z.boolean() }),
  }),
});

export { listPlacesTool };
