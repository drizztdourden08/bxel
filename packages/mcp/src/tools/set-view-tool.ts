/* @layer core @kind logic */
import { z } from 'zod';
import { MAP_SELECTION_REPLY_SCHEMA, SELECTION_REPLY_SCHEMA, SET_VIEW_INPUT_SCHEMA } from '../schema/view.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const setViewTool = defineTool(TOOL_NAME.setView, {
  title: 'Set the view',
  description:
    'Changes what the owner sees, in one patch applied in order, and the owner watches it happen. dialog answers a confirm dialog the owner left open; focus activates a tab (raise brings the window to the front); page opens a settings page; zoom takes a percent, "fit", "actual" or a pixel rect to fit; pan centres on a pixel; toggles flips the grids, guides, rulers, tiled preview and onion skin; playback plays or pauses; timeline moves the playhead, sets the picked frames, the play range, mode and speed, the strip zoom and time mode, and the onion skin (a show effect, it never edits the document); select picks the sprite, frame, layer, map layer or tile; tool, colours, symmetry and selection set the state the next stroke uses. A selection travels as row runs [[y, x0, x1], ...]. mapSelection selects cells on the open tilemap by description (rect, wand, same, tile, runs, combine) and replies with the cell count, bounds and row runs. properties pins the Properties panel to an open file; browse sets the folder, view, selection and search of the Browse page; reveal opens the Browse page on a file; projectPanel sets the mode, selection, search and chips of the Project panel widget; tileset sets the tileset panel mode and search, the map stamp, scatter, brush flags, terrain brush and set, collision overlay, tile animation, thumbnail zoom and the key and use badges. At Read level only focus, page, zoom, pan, toggles, playback, timeline, properties, browse, reveal and projectPanel apply.',
  input: SET_VIEW_INPUT_SCHEMA,
  output: withFailure({
    applied: z.array(z.string()).describe('The fields of the patch that were applied, in order.'),
    visible: z.boolean(),
    selection: SELECTION_REPLY_SCHEMA.nullable().describe('The selection after the patch, when the patch touched it.'),
    mapSelection: MAP_SELECTION_REPLY_SCHEMA.nullable().describe('The selected map cells after the patch, when the patch touched them.'),
  }),
});

export { setViewTool };
