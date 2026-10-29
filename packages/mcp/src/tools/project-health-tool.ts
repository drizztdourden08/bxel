/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { HEALTH_CHECK_SCHEMA, HEALTH_CHECK_VALUES } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const finding = z.strictObject({
  check: HEALTH_CHECK_SCHEMA,
  fix: z.string().describe('An id for this finding. repair_links takes the link ones by file and linkId.'),
  message: z.string(),
  file: LOCATION_SCHEMA.nullable(),
  linkId: z.string().optional().describe('For broken and moved: the id of the link in the file.'),
  foundAt: LOCATION_SCHEMA.nullable().optional().describe('For moved: where the file with the asset is now.'),
  expectedFolder: LOCATION_SCHEMA.nullable().optional().describe('For misplaced: the folder the file belongs in.'),
  sharedWith: z.array(LOCATION_SCHEMA).optional().describe('For duplicates: every file with the same asset id.'),
});

const projectHealthTool = defineTool(TOOL_NAME.projectHealth, {
  title: 'Project health',
  description:
    'Checks a granted project and lists what needs a look: links to files that are gone or moved, files nothing uses, files in the folder of another kind, files that share an asset id, unsaved files and folders without permission. Each finding names the file; repair_links fixes the link ones. Findings in folders the assistant cannot see are left out.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    checks: z.array(HEALTH_CHECK_SCHEMA).max(HEALTH_CHECK_VALUES.length).optional().describe('Only these checks. Default: all of them.'),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    files: z.number().int().min(0).describe('How many asset files were checked.'),
    total: z.number().int().min(0),
    findings: z.array(finding),
  }),
});

export { projectHealthTool };
