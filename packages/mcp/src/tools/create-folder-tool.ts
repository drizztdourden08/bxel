/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FOLDER_PLACE_SCHEMA } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const createFolderTool = defineTool(TOOL_NAME.createFolder, {
  title: 'Create a folder',
  description: 'Makes a new folder inside a folder of a granted project. Needs editing access to the project.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    in: FOLDER_PLACE_SCHEMA,
    name: z.string().min(1).max(64).describe('The folder name, no slashes.'),
  }),
  output: withFailure({ projectId: PROJECT_ID_SCHEMA, folder: LOCATION_SCHEMA }),
});

export { createFolderTool };
