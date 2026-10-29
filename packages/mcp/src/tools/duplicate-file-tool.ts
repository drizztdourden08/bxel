/* @layer core @kind logic */
import { z } from 'zod';
import { FILE_PLACE_SCHEMA } from '../schema/project-files.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { defineTool } from './define-tool';
import { withFailure } from '../schema/with-failure';
import { TOOL_NAME } from './tool-name.constants';

const duplicateFileTool = defineTool(TOOL_NAME.duplicateFile, {
  title: 'Duplicate files',
  description:
    'Makes a copy of files of a granted project beside the originals, named like the owner would (name copy). A Bxel asset gets new asset ids, so the copy is its own asset and the links to the original stay with the original. Other files are copied as they are. The project must be open in Bxel. Needs editing access to the project.',
  input: z.strictObject({ projectId: PROJECT_ID_SCHEMA, files: z.array(FILE_PLACE_SCHEMA).min(1).max(20) }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    created: z.array(z.strictObject({ from: LOCATION_SCHEMA, to: LOCATION_SCHEMA })),
  }),
});

export { duplicateFileTool };
