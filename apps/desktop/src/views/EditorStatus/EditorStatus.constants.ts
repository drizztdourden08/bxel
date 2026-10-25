/* @layer renderer-app @kind constants */
import type { ToolId } from '../../editor/tool.type';
import { REGION_COMMAND } from '../../regions/regions.constants';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { SELECTION_COMMAND_ID } from '../../keymap/selection-command-id.constants';
import type { HintShortcut } from '../ActionHint';

const CANVAS_HELP_TEXT = {
  name: 'Canvas controls',
  tool: (label: string): string => `What the mouse and keys do with the ${label} tool, and everywhere on the canvas.`,
  sheet: 'What the mouse and keys do on the sheet, and everywhere on the canvas.',
  map: (label: string): string => `What the mouse and keys do with the ${label} tool on the map, and everywhere on the canvas.`,
} as const;

const PICK_COLOUR: HintShortcut = { label: 'Pick a colour', keys: ['alt'], mouse: 'left' };

const COMMON_ROWS: readonly HintShortcut[] = [
  { label: 'Zoom', mouse: 'wheel' },
  { label: 'Pan sideways', keys: ['shift'], mouse: 'wheel' },
  { label: 'Pan by dragging', mouse: 'middle' },
  { label: 'Pan with the main button', keys: ['space'], mouse: 'drag' },
  { label: 'Zoom to fit', command: COMMAND_ID.zoomFit },
  { label: 'Actual size', command: COMMAND_ID.zoomActual },
  { label: 'Cancel a preview or stroke', keys: ['esc'] },
  { label: 'Paint at the keyboard cursor', keys: ['space'] },
  { label: 'Next region', command: REGION_COMMAND.next },
];

const STRAIGHT_LINE: HintShortcut = { label: 'Straight line', keys: ['shift'], mouse: 'drag' };

const TOOL_ROWS: Readonly<Record<ToolId, readonly HintShortcut[]>> = {
  pencil: [
    { label: 'Draw with the front colour', mouse: 'drag' },
    { label: 'Draw with the back colour', mouse: 'right' },
    STRAIGHT_LINE,
    PICK_COLOUR,
  ],
  eraser: [{ label: 'Erase', mouse: 'drag' }, STRAIGHT_LINE, PICK_COLOUR],
  fill: [{ label: 'Fill with the front colour', mouse: 'left' }, { label: 'Fill with the back colour', mouse: 'right' }, PICK_COLOUR],
  picker: [{ label: 'Pick the front colour', mouse: 'left' }, { label: 'Pick the back colour', mouse: 'right' }],
  shape: [
    { label: 'Draw with the front colour', mouse: 'drag' },
    { label: 'Keep square, round or snapped', keys: ['shift'], mouse: 'drag' },
    { label: 'Draw with the back colour', mouse: 'right' },
    PICK_COLOUR,
  ],
  zoom: [{ label: 'Zoom in', mouse: 'left' }, { label: 'Zoom out', mouse: 'right' }],
  hand: [{ label: 'Move the canvas', mouse: 'drag' }],
  select: [
    { label: 'Select', mouse: 'drag' },
    { label: 'Add to the selection', keys: ['shift'], mouse: 'drag' },
    { label: 'Subtract from it', keys: ['alt'], mouse: 'drag' },
    { label: 'Deselect', command: SELECTION_COMMAND_ID.clear },
  ],
  move: [
    { label: 'Move the selection', mouse: 'drag' },
    { label: 'Nudge with the arrow keys, Shift for 8 pixels' },
  ],
};

const TURN_ROWS: readonly HintShortcut[] = [
  { label: 'Flip the tile in X', command: SELECTION_COMMAND_ID.flipHorizontal },
  { label: 'Flip the tile in Y', command: SELECTION_COMMAND_ID.flipVertical },
  { label: 'Rotate the tile 90', command: SELECTION_COMMAND_ID.turnClockwise },
];

const MAP_ROWS: Readonly<Record<ToolId, readonly HintShortcut[]>> = {
  pencil: [{ label: 'Place the picked tiles', mouse: 'drag' }, ...TURN_ROWS],
  eraser: [{ label: 'Clear cells', mouse: 'drag' }],
  fill: [{ label: 'Fill the connected cells with the picked tile', mouse: 'left' }, ...TURN_ROWS],
  picker: [{ label: 'Pick the tile and its turn', mouse: 'left' }],
  shape: [{ label: 'Drag a rectangle of the picked tile', mouse: 'drag' }, ...TURN_ROWS],
  zoom: [{ label: 'Zoom in', mouse: 'left' }, { label: 'Zoom out', mouse: 'right' }],
  hand: [{ label: 'Move the map', mouse: 'drag' }],
  select: [
    { label: 'Select cells', mouse: 'drag' },
    { label: 'Turn the selected cells', command: SELECTION_COMMAND_ID.flipHorizontal },
    { label: 'Clear the selected cells', keys: ['delete'] },
    { label: 'Deselect', command: SELECTION_COMMAND_ID.clear },
  ],
  move: [],
};

const SHEET_ROWS: readonly HintShortcut[] = [
  { label: 'Select a sprite', mouse: 'left' },
  { label: 'Add or remove one', keys: ['ctrl'], mouse: 'left' },
  { label: 'Select a range', keys: ['shift'], mouse: 'left' },
  { label: 'Move the selected sprites', mouse: 'drag' },
  { label: 'Double click a sprite to edit it on its own' },
  { label: 'Nudge with the arrow keys, Shift for 8 pixels' },
];

export { CANVAS_HELP_TEXT, COMMON_ROWS, MAP_ROWS, SHEET_ROWS, TOOL_ROWS };
