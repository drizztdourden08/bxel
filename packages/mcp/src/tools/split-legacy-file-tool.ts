/* @layer core @kind logic */
import { z } from 'zod';
import { ASSET_KIND_SCHEMA } from '../schema/assets.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const splitLegacyFileTool = defineTool(TOOL_NAME.splitLegacyFile, {
  title: 'Split an older file',
  description:
    'Splits an older .bxel file that holds several assets into separate files in the same project: one .bxsprite per sprite, one .bxsheet per sheet, one .bxpalette per palette, and .bxtiles and .bxmap files for tilemaps. The project must be granted editing. The older file is not touched. Names already taken get a number. Open the new files with open_file.',
  input: z.strictObject({ file: LOCATION_SCHEMA.describe('The older .bxel file, in a project folder.') }),
  output: withFailure({
    files: z.array(
      z.strictObject({
        kind: ASSET_KIND_SCHEMA,
        name: z.string(),
        location: LOCATION_SCHEMA,
        renamed: z.boolean().describe('True when the name was changed to fit a file name or to avoid a clash.'),
      }),
    ),
    skipped: z.number().int().min(0).describe('Assets that could not be placed in a folder the assistant may see.'),
  }),
});

export { splitLegacyFileTool };
