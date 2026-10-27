/* @layer core @kind logic */
import { z } from 'zod';
import { SELECTION_REPLY_SCHEMA, SET_VIEW_INPUT_SCHEMA } from '../schema/view.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const setViewTool = defineTool(TOOL_NAME.setView, {
  title: 'Set the view',
  description:
    'Changes what the owner sees, in one patch applied in order, and the owner watches it happen. focus activates a tab (raise brings the window to the front); page opens a settings page; zoom takes a percent, "fit", "actual" or a pixel rect to fit; pan centres on a pixel; toggles flips the grids, guides, rulers, tiled preview and onion skin; playback plays or pauses; select picks the sprite, frame, layer, map layer or tile; tool, colours, symmetry and selection set the state the next stroke uses. A selection travels as row runs [[y, x0, x1], ...]. At Read level only focus, page, zoom, pan, toggles and playback apply.',
  input: SET_VIEW_INPUT_SCHEMA,
  output: withFailure({
    applied: z.array(z.string()).describe('The fields of the patch that were applied, in order.'),
    visible: z.boolean(),
    selection: SELECTION_REPLY_SCHEMA.nullable().describe('The selection after the patch, when the patch touched it.'),
  }),
});

export { setViewTool };
