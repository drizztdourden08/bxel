/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FILE_PLACE_SCHEMA } from '../schema/project-files.constants';
import { defineTool } from './define-tool';
import { withFailure } from '../schema/with-failure';
import { TOOL_NAME } from './tool-name.constants';

const trashFilesTool = defineTool(TOOL_NAME.trashFiles, {
  title: 'Trash files',
  description:
    'Moves files or folders of a granted project to the system trash. Bxel cannot bring them back; the owner restores them from the trash. Refused when another file links to one of them, unless breakLinks is true; those files then show a missing link, and the reply lists them. The project must be open in Bxel. Needs editing access to the project.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    files: z.array(FILE_PLACE_SCHEMA).min(1).max(50),
    breakLinks: z.boolean().default(false).describe('True to trash files that other files still link to.'),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    trashed: z.array(LOCATION_SCHEMA),
    brokenLinksIn: z.array(LOCATION_SCHEMA).describe('The files that now show a missing link.'),
  }),
});

export { trashFilesTool };
