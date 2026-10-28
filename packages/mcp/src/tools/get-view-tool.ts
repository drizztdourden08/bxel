/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { SELECTION_REPLY_SCHEMA } from '../schema/view.constants';
import { defineTool } from './define-tool';
import { NO_INPUT_SCHEMA, WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const block = z.record(z.string(), z.unknown());

const getViewTool = defineTool(TOOL_NAME.getView, {
  title: 'Get the view',
  description:
    "The owner's live window: the open tabs and the active one, the page and any confirm dialog, the active sprite, frame and layer, the tool and its options, the four colours, symmetry, zoom and the visible pixel rectangle, the grid and view toggles, playback, the selection as row runs, and the clipboard.",
  input: NO_INPUT_SCHEMA,
  output: withFailure({
    window: WINDOW_SCHEMA,
    visible: z.boolean().describe('False on a headless instance: calls still apply but nobody sees them.'),
    page: z.string().nullable().describe('The settings page or screen on top of the editor, or null.'),
    dialog: block.nullable().describe('A confirm dialog the owner has open: id, title, message and choices.'),
    tabs: z.array(
      z.strictObject({ tabId: z.string(), documentId: z.string(), name: z.string(), asset: z.string().nullable(), dirty: z.boolean(), active: z.boolean() }),
    ),
    active: block.nullable().describe('documentId, revision, mode, sprite, frame, layer, map layer, tile mode.'),
    tool: block,
    colours: block,
    symmetry: block,
    zoom: block.nullable().describe('percent, pan and the visible pixel rectangle.'),
    toggles: block,
    playback: block,
    selection: SELECTION_REPLY_SCHEMA.extend({ variant: z.string(), combine: z.string() }).nullable(),
    clipboard: block.nullable(),
    sprites: block.describe('The sprite selection and filters of the sheet manager.'),
  }),
});

export { getViewTool };
