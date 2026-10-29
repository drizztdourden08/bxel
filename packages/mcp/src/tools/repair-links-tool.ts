/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { FILE_PLACE_SCHEMA, FIX_BY_VALUES } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const fix = z.strictObject({
  file: FILE_PLACE_SCHEMA.describe('The file that holds the link.'),
  linkId: z.string().min(1).max(128).describe('The linkId of a finding from project_health.'),
  by: z.enum(FIX_BY_VALUES).describe('id: follow the asset id to the file that has it. path: use the file named in to, which must hold that asset. remove: drop the link from the file.'),
  to: FILE_PLACE_SCHEMA.optional().describe('For by path.'),
});

const repairLinksTool = defineTool(TOOL_NAME.repairLinks, {
  title: 'Repair links',
  description:
    'Rewrites link paths in project files so they lead to the right file again. Pass fixes one by one, or all: true to follow the asset id for every link with an old path. Only the link list of each file changes. Files with unsaved edits in Bxel keep them. Needs editing access to the project.',
  input: z
    .strictObject({
      projectId: PROJECT_ID_SCHEMA,
      fixes: z.array(fix).min(1).max(100).optional(),
      all: z.boolean().optional().describe('Follow the asset id for every moved link of the project.'),
    })
    .refine((input) => (input.fixes === undefined) !== (input.all !== true), { message: 'Give either fixes or all: true.' }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    fixed: z.number().int().min(0),
    skipped: z.array(z.strictObject({ file: z.string(), linkId: z.string(), reason: z.string() })),
  }),
});

export { repairLinksTool };
