/* @layer renderer-app @kind constants */
const EDITOR_CANVAS_TEXT = {
  label: 'Sprite canvas',
  hint: 'Arrow keys move the drawing cursor. Space paints with the front colour and Enter with the back colour. Shift with Space draws a line from the last point. Control picks the third and fourth colours. With the shapes tool, press once to start and again to finish. Shift with an arrow pans the view.',
  empty: 'No sprite is open.',
} as const;

const CANVAS_CLASS = {
  plain: 'editor-canvas',
  rulers: 'editor-canvas editor-canvas--rulers',
  viewport: 'editor-canvas__viewport',
} as const;

const CANVAS_MENU = {
  zone: 'canvas.sprite',
  label: 'Canvas actions',
  slots: [1, 2, 3, 4],
  asColour: (slot: number): string => `As colour ${slot}`,
  pickHere: 'Pick colour here',
  selectHere: 'Select here',
  region: 'Region of this colour',
  everywhere: 'Every pixel of this colour',
  symmetry: 'Symmetry',
  axisX: 'Put the X mirror axis here',
  axisY: 'Put the Y mirror axis here',
  axisCentre: 'Centre the mirror axes',
  symmetryOff: 'Both symmetries are off.',
  canvas: 'Canvas',
  transform: 'Transform',
  selection: 'Selection',
  backToPlace: 'Back to Place Tile',
  emptyClipboard: 'The clipboard holds no pixels.',
  thin: 'The selection is too thin to shrink.',
} as const;

const MENU_TOOLS: readonly string[] = ['hand', 'select', 'move'];

const OVERLAY_TOKENS = {
  axis: '--c-tertiary',
  cursor: '--c-danger',
  ink: '--c-primary',
  ground: '--c-sunken',
} as const;

const OUTLINE_PATHS = new WeakMap<object, Path2D>();

const AREA_FILL_ALPHA = 0.25;

const AREA_LINE = 2;

const ANT_DASH = 4;

const ANT_PERIOD = 8;

const ANT_STEP_MS = 90;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const AXIS_GRAB = { across: 6, along: 14 } as const;

const AXIS_DASH: readonly number[] = [4, 3];

const AXIS_GRIP = 5;

export {
  ANT_DASH, ANT_PERIOD, ANT_STEP_MS, AREA_FILL_ALPHA, AREA_LINE, AXIS_DASH, AXIS_GRAB, AXIS_GRIP, CANVAS_CLASS, CANVAS_MENU, EDITOR_CANVAS_TEXT, MENU_TOOLS, OUTLINE_PATHS, OVERLAY_TOKENS,
  REDUCED_MOTION,
};
