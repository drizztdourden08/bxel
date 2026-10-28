/* @layer core @kind logic */
import { z } from 'zod';
import { SETTING_SCOPE_SCHEMA } from '../schema/layout.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const setSettingTool = defineTool(TOOL_NAME.setSetting, {
  title: 'Change a setting',
  description:
    'Changes one setting of the app, the open project or the open asset, as the page would. The value is checked against the control of the page and the stored value comes back. Keys that start with assistant or keymap are refused: a program cannot widen its own access. Use get_settings for the keys. With show the page opens at that section so the owner sees the change.',
  input: z.strictObject({
    scope: SETTING_SCOPE_SCHEMA,
    target: z.string().min(1).max(200).optional().describe('asset: a tab id from get_view. project: the project id.'),
    key: z.string().min(1).max(200),
    value: z.unknown().describe('The new value, in the shape get_settings shows for the key.'),
    show: z.boolean().default(false),
  }),
  output: withFailure({
    scope: SETTING_SCOPE_SCHEMA,
    key: z.string(),
    value: z.unknown().describe('The value now stored.'),
    shown: z.boolean(),
  }),
});

export { setSettingTool };
