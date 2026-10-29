/* @layer core @kind logic */
import { z } from 'zod';
import { ASSET_KIND_SCHEMA } from '../schema/assets.constants';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { FILE_PLACE_SCHEMA, REFERENCE_SCHEMA } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const findReferencesTool = defineTool(TOOL_NAME.findReferences, {
  title: 'Find references',
  description:
    'Which files link to a file of a granted project (usedBy) and which files it links to (uses). Reads the links stored in the files on disk, so it covers files that are not opened and tells a link whose path is out of date (moved) or whose file is gone (missing). Name the file with file, or the asset with assetId.',
  input: z
    .strictObject({
      projectId: PROJECT_ID_SCHEMA,
      file: FILE_PLACE_SCHEMA.optional(),
      assetId: z.string().min(1).max(128).optional().describe('An asset id from list_assets. Use this or file.'),
      direction: z.enum(['usedBy', 'uses', 'both']).default('both'),
    })
    .refine((input) => (input.file === undefined) !== (input.assetId === undefined), { message: 'Give either file or assetId.' }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    target: z.strictObject({ assetId: z.string(), kind: ASSET_KIND_SCHEMA, name: z.string(), location: LOCATION_SCHEMA }),
    usedBy: z.array(REFERENCE_SCHEMA),
    uses: z.array(REFERENCE_SCHEMA),
  }),
});

export { findReferencesTool };
