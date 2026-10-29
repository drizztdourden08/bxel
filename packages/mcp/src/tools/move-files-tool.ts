/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FILE_PLACE_SCHEMA, FOLDER_PLACE_SCHEMA } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const moveFilesTool = defineTool(TOOL_NAME.moveFiles, {
  title: 'Move files',
  description:
    'Moves files or folders of a granted project into another folder, as the owner would in the Project window. Every file that links to a moved file gets its link rewritten, also files with unsaved edits in Bxel and files that are not opened, so nothing shows a missing link. Refused when a file that would be rewritten is in a folder the assistant cannot see. The project must be open in Bxel. Needs editing access to the project.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    files: z.array(FILE_PLACE_SCHEMA).min(1).max(50),
    into: FOLDER_PLACE_SCHEMA,
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    moved: z.array(z.strictObject({ from: LOCATION_SCHEMA, to: LOCATION_SCHEMA })),
    linksRewritten: z.number().int().min(0).describe('How many other files had a link rewritten.'),
  }),
});

export { moveFilesTool };
