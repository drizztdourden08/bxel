/* @layer renderer-app @kind constants */
import type { ToolId } from '../../editor/tool.type';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { SELECTION_COMMAND_ID } from '../../keymap/selection-command-id.constants';
import type { HintShortcut } from '../ActionHint';

const NEXT_REGION = 'brock.region.next';

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
  { label: 'Next region', command: NEXT_REGION },
];

const STRAIGHT_LINE: HintShortcut = { label: 'Straight line', keys: ['shift'], mouse: 'drag' };

const SHAPE_ROWS: readonly HintShortcut[] = [
  { label: 'Draw from the centre', keys: ['alt'], mouse: 'drag' },
  { label: 'Move the shape while dragging', keys: ['space'], mouse: 'drag' },
  { label: 'Draw with the back colour', mouse: 'right' },
  PICK_COLOUR,
];

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
  spray: [{ label: 'Spray with the front colour', mouse: 'drag' }, { label: 'Spray with the back colour', mouse: 'right' }, PICK_COLOUR],
  gradient: [
    { label: 'Drag the gradient line', mouse: 'drag' },
    { label: 'Snap the angle', keys: ['shift'], mouse: 'drag' },
    { label: 'Run the gradient the other way', mouse: 'right' },
    PICK_COLOUR,
  ],
  line: [{ label: 'Draw a line', mouse: 'drag' }, ...SHAPE_ROWS, { label: 'Snap to a clean ratio', keys: ['shift'], mouse: 'drag' }],
  curve: [
    { label: 'Drag the ends, release, then move to bend', mouse: 'drag' },
    { label: 'Click to finish the curve', mouse: 'left' },
    { label: 'Finish or cancel', keys: ['enter'] },
    PICK_COLOUR,
  ],
  rect: [{ label: 'Draw a rectangle', mouse: 'drag' }, ...SHAPE_ROWS, { label: 'Keep it square', keys: ['shift'], mouse: 'drag' }],
  ellipse: [{ label: 'Draw an ellipse', mouse: 'drag' }, ...SHAPE_ROWS, { label: 'Keep it round', keys: ['shift'], mouse: 'drag' }],
  contour: [{ label: 'Draw a free outline', mouse: 'drag' }, { label: 'Draw with the back colour', mouse: 'right' }, PICK_COLOUR],
  polygon: [
    { label: 'Click each corner', mouse: 'left' },
    { label: 'Snap the edge to a clean ratio', keys: ['shift'], mouse: 'left' },
    { label: 'Close the polygon', keys: ['enter'] },
    { label: 'Remove the last corner', keys: ['backspace'] },
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
  rect: [{ label: 'Drag a rectangle of the picked tile', mouse: 'drag' }, ...TURN_ROWS],
  line: [{ label: 'Drag a line of the picked tile', mouse: 'drag' }, ...TURN_ROWS],
  spray: [{ label: 'Place random tiles from the selection', mouse: 'drag' }, ...TURN_ROWS],
  gradient: [],
  curve: [],
  ellipse: [],
  contour: [],
  polygon: [],
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

const STATUS_MENU = {
  zone: 'editor.status',
  label: 'Status bar actions',
  zoomTo: 'Zoom to',
  edit: 'Edit colour...',
  reveal: 'Reveal in folder',
  copyPath: 'Copy path',
  saved: 'This asset has no unsaved changes.',
  outside: 'The pointer is outside the image.',
} as const;

const ZOOM_PERCENTS: readonly number[] = [100, 200, 400, 800, 1600];

export { CANVAS_HELP_TEXT, COMMON_ROWS, MAP_ROWS, SHEET_ROWS, STATUS_MENU, TOOL_ROWS, ZOOM_PERCENTS };
