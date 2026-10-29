/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FILE_PLACE_SCHEMA, FOLDER_PLACE_SCHEMA } from '../schema/project-files.constants';
import { defineTool } from './define-tool';
import { withFailure } from '../schema/with-failure';
import { TOOL_NAME } from './tool-name.constants';

const importFilesTool = defineTool(TOOL_NAME.importFiles, {
  title: 'Import files',
  description:
    'Turns image and palette files that are already in a granted project into Bxel assets, with the import defaults of the project: a PNG becomes a sprite, an animated GIF an animation, and a GPL, PAL or palette PNG a palette. The new files are saved in the role folders of the project, or in into. Tiled files are not imported here. The project must be open in Bxel. Needs editing access to the project.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    sources: z.array(FILE_PLACE_SCHEMA).min(1).max(20),
    into: FOLDER_PLACE_SCHEMA.optional().describe('Move the new files here after they are saved.'),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    imported: z.array(z.strictObject({ source: LOCATION_SCHEMA, created: z.array(LOCATION_SCHEMA) })),
    skipped: z.array(z.strictObject({ path: z.string(), reason: z.string() })),
  }),
});

export { importFilesTool };
