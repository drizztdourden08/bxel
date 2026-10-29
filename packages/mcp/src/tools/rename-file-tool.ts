/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FILE_PLACE_SCHEMA } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const renameFileTool = defineTool(TOOL_NAME.renameFile, {
  title: 'Rename a file',
  description:
    'Renames a file or folder of a granted project and keeps every link to it: the files that link to it get the new path, also files with unsaved edits and files that are not opened. The asset takes the new name too. Give the new name with or without the ending; a file keeps its ending. The project must be open in Bxel. Needs editing access to the project.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    file: FILE_PLACE_SCHEMA,
    name: z.string().min(1).max(64).describe('The new name, no slashes.'),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    from: LOCATION_SCHEMA,
    to: LOCATION_SCHEMA,
    linksRewritten: z.number().int().min(0),
  }),
});

export { renameFileTool };
