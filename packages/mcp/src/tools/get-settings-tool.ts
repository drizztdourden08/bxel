/* @layer core @kind logic */
import { z } from 'zod';
import { SETTING_SCOPE_SCHEMA } from '../schema/layout.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PAGE_SCHEMA } from './get-settings-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const getSettingsTool = defineTool(TOOL_NAME.getSettings, {
  title: 'Get the settings',
  description:
    'Reads the settings the pages of Settings show, for one scope: app (the Settings pages), project (the open project) or asset (the sprite, animation, sheet, palette or map that is open). Each item has its key, label and value; with schema it also has its control, choices and range. Keys that start with assistant or keymap are listed locked with no value. For project and asset, the open item answers; pass target to name the tab of the asset (from get_view) or the project id.',
  input: z.strictObject({
    scope: SETTING_SCOPE_SCHEMA,
    target: z.string().min(1).max(200).optional().describe('asset: a tab id from get_view. project: the project id.'),
    page: z.string().min(1).max(100).optional().describe('Only one page, by id or label.'),
    keys: z.array(z.string().min(1).max(200)).max(200).optional().describe('Only these keys.'),
    schema: z.boolean().default(false),
  }),
  output: withFailure({
    scope: SETTING_SCOPE_SCHEMA,
    pages: z.array(PAGE_SCHEMA),
    routes: z.array(z.strictObject({ route: z.string(), title: z.string(), kind: z.string() })).describe('The routes set_view page accepts.'),
  }),
});

export { getSettingsTool };
