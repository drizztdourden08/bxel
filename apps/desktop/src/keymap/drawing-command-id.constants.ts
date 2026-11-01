/* @layer renderer-app @kind constants */
const DRAWING_TOOL_IDS = ['spray', 'shade', 'gradient', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'] as const;

const INK_TOOLS = ['pencil', 'spray', 'fill', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'] as const;

const INK_NAMES = ['ink', 'dither_pattern', 'dither_level', 'dither_custom', 'shade_steps', 'shade_ramp', 'pattern_align'] as const;

const BRUSH_ANGLE_TOOLS = ['pencil', 'eraser', 'shade', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'] as const;

const FILLED_TOOLS = ['rect', 'ellipse', 'curve', 'polygon', 'contour'] as const;

const LOCK_TOOLS = ['pencil', 'eraser', 'spray', 'fill'] as const;

const DRAWING_OPTION_IDS: readonly string[] = [
  ...INK_TOOLS.flatMap((tool) => INK_NAMES.map((name) => `${tool}.${name}`)),
  ...FILLED_TOOLS.flatMap((tool) => [`${tool}.filled`, `${tool}.fill_colour`]),
  'rect.radius',
  ...BRUSH_ANGLE_TOOLS.map((tool) => `${tool}.angle`),
  ...BRUSH_ANGLE_TOOLS.filter((tool) => tool !== 'pencil').map((tool) => `${tool}.custom_brush`),
  ...BRUSH_ANGLE_TOOLS.map((tool) => `${tool}.brush_spacing`),
  'line.even_steps',
  'curve.perfect',
  'curve.cubic',
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
  'spray.pressure',
  'pencil.stabiliser',
  'eraser.stabiliser',
  'shade.stabiliser',
  'gradient.kind',
  'gradient.mode',
  'gradient.pattern',
  'gradient.custom',
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
  moveShape: 'drawing.hold_move_shape',
  outline: 'edit.outline',
  outlineInside: 'edit.outline_inside',
  outlineRing: 'edit.outline_ring',
  outlineSelOut: 'edit.outline_sel_out',
  outlineFrames: 'edit.outline_frames',
  antiAlias: 'edit.anti_alias',
} as const;

const OUTLINE_ACTIONS: readonly string[] = [DRAWING_COMMAND.outline, DRAWING_COMMAND.outlineInside, DRAWING_COMMAND.antiAlias];

const DRAWING_COMMAND_IDS: readonly string[] = Object.values(DRAWING_COMMAND);

export { BRUSH_ANGLE_TOOLS, INK_COMMAND, DRAWING_COMMAND, OUTLINE_ACTIONS, DRAWING_COMMAND_IDS, DRAWING_OPTION_COMMAND_IDS, DRAWING_TOOL_IDS, FILLED_TOOLS, INK_TOOLS, LOCK_TOOLS };
