/* @layer renderer-app @kind constants */
const DRAWING_TOOL_IDS = ['spray', 'shade', 'gradient', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'] as const;

const INK_TOOLS = ['pencil', 'spray', 'fill', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'] as const;

const INK_NAMES = ['ink', 'dither_pattern', 'dither_level', 'shade_steps', 'shade_ramp'] as const;

const FILLED_TOOLS = ['rect', 'ellipse', 'curve', 'polygon', 'contour'] as const;

const LOCK_TOOLS = ['pencil', 'eraser', 'spray', 'fill'] as const;

const DRAWING_OPTION_IDS: readonly string[] = [
  ...INK_TOOLS.flatMap((tool) => INK_NAMES.map((name) => `${tool}.${name}`)),
  ...FILLED_TOOLS.flatMap((tool) => [`${tool}.filled`, `${tool}.fill_colour`]),
  'rect.radius',
  'line.even_steps',
  'curve.perfect',
  'contour.perfect',
  'shade.mode',
  'shade.steps',
  'shade.ramp',
  'picker.sample',
  'fill.sample',
  'fill.match',
  'spray.size',
  'spray.density',
  'spray.seed',
  'gradient.kind',
  'gradient.mode',
  'gradient.pattern',
  'gradient.size',
  'gradient.reflect',
  'gradient.ramp',
  'pencil.custom_brush',
  'pencil.brush_stencil',
  'pencil.brush_flip_x',
  'pencil.brush_flip_y',
  'pencil.brush_turn',
  ...LOCK_TOOLS.map((tool) => `${tool}.lock_tile`),
];

const INK_COMMAND = 'drawing.cycle_ink';

const DRAWING_OPTION_COMMAND_IDS: readonly string[] = [
  INK_COMMAND,
  ...DRAWING_OPTION_IDS.filter((id) => !id.endsWith('.ink')).map((id) => `options.${id}`),
];

const DRAWING_COMMAND = {
  symmetryDiagonal: 'symmetry.toggle_diagonal',
  symmetryTurn: 'symmetry.toggle_turn',
  brushFromSelection: 'brush.from_selection',
} as const;

const DRAWING_COMMAND_IDS: readonly string[] = Object.values(DRAWING_COMMAND);

export { INK_COMMAND, DRAWING_COMMAND, DRAWING_COMMAND_IDS, DRAWING_OPTION_COMMAND_IDS, DRAWING_OPTION_IDS, DRAWING_TOOL_IDS, FILLED_TOOLS, INK_NAMES, INK_TOOLS, LOCK_TOOLS };
