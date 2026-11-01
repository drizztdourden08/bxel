/* @layer core @kind logic */
import { z } from 'zod';
import { withFailure } from '../schema/with-failure';
import { TIMELINE_STATE_SCHEMA } from '../schema/timeline-view.constants';
import { MAP_SELECTION_REPLY_SCHEMA, SELECTION_REPLY_SCHEMA } from '../schema/view.constants';
import { defineTool } from './define-tool';
import { UI_VIEW_SCHEMA } from './get-view-tool.constants';
import { NO_INPUT_SCHEMA, WINDOW_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const block = z.record(z.string(), z.unknown());

const getViewTool = defineTool(TOOL_NAME.getView, {
  title: 'Get the view',
  description:
    "The owner's live window: the open tabs and the active one, the page and any confirm dialog, the active sprite, frame and layer, the tool and its options, the four colours, symmetry, zoom and the visible pixel rectangle, the grid and view toggles, playback, the timeline (playhead, picked frames, range, play mode, speed, zoom and the onion skin settings), the selection as row runs, and the clipboard.",
  input: NO_INPUT_SCHEMA,
  output: withFailure({
    window: WINDOW_SCHEMA,
    visible: z.boolean().describe('False on a headless instance: calls still apply but nobody sees them.'),
    page: z.string().nullable().describe('The settings page or screen on top of the editor, or null.'),
    dialog: block.nullable().describe('A confirm dialog the owner has open: id, title, message and choices.'),
    context: block.describe('What the window is showing, the derived context every command and widget rule reads: fileType, surface, editTarget, tileMode, isolated, selection, clipboard, pending, tool, readOnly, canUndo, canRedo.'),
    ui: UI_VIEW_SCHEMA,
    tabs: z.array(
      z.strictObject({ tabId: z.string(), documentId: z.string(), name: z.string(), asset: z.string().nullable(), dirty: z.boolean(), active: z.boolean() }),
    ),
    active: block.nullable().describe('documentId, revision, mode, sprite, frame, layer, map layer, tile mode.'),
    tool: block,
    colours: block,
    symmetry: block,
    zoom: block.nullable().describe('percent, pan and the visible pixel rectangle.'),
    toggles: block,
    pointer: z.strictObject({ x: z.number().int(), y: z.number().int() }).nullable().describe('The pixel under the owner pointer or keyboard cursor, so "this pixel" can be resolved.'),
    playback: block,
    timeline: TIMELINE_STATE_SCHEMA.describe('The timeline: animation, playhead, pick, range, play state, zoom and the onion skin settings.'),
    selection: SELECTION_REPLY_SCHEMA.extend({ variant: z.string(), combine: z.string() }).nullable(),
    mapSelection: MAP_SELECTION_REPLY_SCHEMA.extend({ variant: z.string(), combine: z.string() }).nullable().describe('The cells selected on the open tilemap, or null.'),
    clipboard: block.nullable(),
    properties: block.describe('The Properties panel: status (none, missing, ready), whether it is pinned, how far back and forward the history goes, and the subject (kind, name, file, dirty).'),
    browse: block.describe('The Browse page: folder, view, search text, chips and the selection as locations.'),
    projectPanel: block.nullable().describe('The Project panel widget: mode, selection as locations, typed search and chips. Null when the panel is not on screen.'),
    tileset: block.describe('The tileset and tilemap tool state: panel mode, search, filters, stamp, scatter, terrain brush and the collision overlay.'),
    sprites: block.describe('The sprite selection and filters of the sheet manager.'),
  }),
});

export { getViewTool };
