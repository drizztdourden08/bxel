/* @layer renderer-app @kind constants */
import type { BrushShape, CombineMode, Connectivity, FillMode, ShapeKind } from '@bxel/raster';
import { MODE_LABELS, SELECT_LABELS } from '../../editor/selection/selection.constants';
import type { SelectVariant } from '../../editor/selection/selection.type';
import {
  CONNECTIVITY_DESCRIPTIONS, FILL_DESCRIPTIONS, MODE_DESCRIPTIONS, MODE_KEYS, SELECT_DESCRIPTIONS, SHAPE_DESCRIPTIONS,
} from '../../editor/tool-descriptions.constants';
import type { ToolId } from '../../editor/tool.type';
import { FILL_LABELS, SHAPE_LABELS } from '../../editor/tools.constants';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { SELECTION_COMMAND_ID } from '../../keymap/selection-command-id.constants';
import type { HintSpec } from '../ActionHint';
import type { OptionKind } from './ContextBar.type';

const CONTEXT_TEXT = {
  region: 'Tool options',
  scope: 'Edit scope',
  lockedIcon: 'Locked',
  sprite: (name: string): string => `Sprite: ${name}`,
  layer: (name: string, state: string): string => (state === '' ? `Layer: ${name}` : `Layer: ${name} (${state})`),
  frame: (at: number, total: number): string => `Frame: ${at} of ${total}`,
  size: 'Brush size',
  brushShape: 'Brush shape',
  square: 'Square',
  circle: 'Circle',
  pixelPerfect: 'Pixel perfect',
  fillMode: 'Fill area',
  neighbours: 'Fill neighbours',
  shapeKind: 'Shape kind',
  filled: 'Filled',
  symmetry: 'Symmetry',
  selectVariant: 'Selection shape',
  selectMode: 'Selection mode',
  wandNeighbours: 'Wand neighbours',
  expand: 'Expand 1',
  shrink: 'Shrink 1',
} as const;

const TOOL_OPTIONS: Readonly<Record<ToolId, readonly OptionKind[]>> = {
  pencil: ['brush', 'pixelPerfect', 'symmetry'],
  eraser: ['brush', 'pixelPerfect', 'symmetry'],
  fill: ['fill'],
  picker: [],
  shape: ['shape', 'brush', 'symmetry'],
  zoom: [],
  hand: [],
  select: ['select'],
  move: [],
};

const MAP_TOOL_OPTIONS: Readonly<Record<ToolId, readonly OptionKind[]>> = {
  pencil: ['mapFlags'],
  eraser: [],
  fill: ['mapFlags'],
  picker: [],
  shape: ['mapFlags', 'mapFilled'],
  zoom: [],
  hand: [],
  select: ['mapSelection', 'mapFlags'],
  move: [],
};

const BRUSH_SHAPES: readonly BrushShape[] = ['square', 'circle'];

const NEIGHBOUR_CHOICES: Readonly<Record<Connectivity, string>> = { 4: '4', 8: '8' };

const BRUSH_SIZE_HINT: HintSpec = {
  name: 'Brush size',
  description: 'How many pixels wide the brush is.',
  shortcuts: [
    { command: COMMAND_ID.brushSmaller, label: 'Smaller' },
    { command: COMMAND_ID.brushLarger, label: 'Larger' },
  ],
};

const BRUSH_SHAPE_HINTS: Readonly<Record<BrushShape, HintSpec>> = {
  square: { name: 'Square', description: 'Paint with a square brush tip.' },
  circle: { name: 'Circle', description: 'Paint with a round brush tip.' },
};

const PIXEL_PERFECT_HINT: HintSpec = {
  name: 'Pixel perfect',
  description: 'Drop the extra corner pixels that make a freehand line look thick.',
};

const FILL_HINTS: Readonly<Record<FillMode, HintSpec>> = {
  contiguous: { name: FILL_LABELS.contiguous, description: FILL_DESCRIPTIONS.contiguous },
  global: { name: FILL_LABELS.global, description: FILL_DESCRIPTIONS.global },
};

const NEIGHBOUR_HINTS: Readonly<Record<Connectivity, HintSpec>> = {
  4: { name: '4 neighbours', description: CONNECTIVITY_DESCRIPTIONS[4] },
  8: { name: '8 neighbours', description: CONNECTIVITY_DESCRIPTIONS[8] },
};

const SHAPE_HINTS: Readonly<Record<ShapeKind, HintSpec>> = {
  line: { name: SHAPE_LABELS.line, description: SHAPE_DESCRIPTIONS.line },
  rect: { name: SHAPE_LABELS.rect, description: SHAPE_DESCRIPTIONS.rect },
  ellipse: { name: SHAPE_LABELS.ellipse, description: SHAPE_DESCRIPTIONS.ellipse },
};

const FILLED_HINT: HintSpec = {
  name: 'Filled',
  description: 'Fill the inside of rectangles and ellipses. Lines have no inside.',
};

const MIRROR_X_HINT: HintSpec = {
  name: 'Mirror X',
  description: 'Mirror strokes from left to right across the symmetry line.',
  shortcuts: [{ command: COMMAND_ID.symmetryX }],
};

const MIRROR_Y_HINT: HintSpec = {
  name: 'Mirror Y',
  description: 'Mirror strokes from top to bottom across the symmetry line.',
  shortcuts: [{ command: COMMAND_ID.symmetryY }],
};

const MIRROR_HINTS: readonly HintSpec[] = [MIRROR_X_HINT, MIRROR_Y_HINT];

const SELECT_VARIANT_HINTS: Readonly<Record<SelectVariant, HintSpec>> = {
  rect: { name: SELECT_LABELS.rect, description: SELECT_DESCRIPTIONS.rect },
  ellipse: { name: SELECT_LABELS.ellipse, description: SELECT_DESCRIPTIONS.ellipse },
  lasso: { name: SELECT_LABELS.lasso, description: SELECT_DESCRIPTIONS.lasso },
  polygon: { name: SELECT_LABELS.polygon, description: SELECT_DESCRIPTIONS.polygon },
  wand: { name: SELECT_LABELS.wand, description: SELECT_DESCRIPTIONS.wand },
  colour: { name: SELECT_LABELS.colour, description: SELECT_DESCRIPTIONS.colour },
};

const SELECT_MODE_HINTS: Readonly<Record<CombineMode, HintSpec>> = {
  replace: { name: MODE_LABELS.replace, description: MODE_DESCRIPTIONS.replace },
  add: { name: MODE_LABELS.add, description: MODE_DESCRIPTIONS.add, shortcuts: [{ keys: MODE_KEYS.add, label: 'Hold' }] },
  subtract: { name: MODE_LABELS.subtract, description: MODE_DESCRIPTIONS.subtract, shortcuts: [{ keys: MODE_KEYS.subtract, label: 'Hold' }] },
  intersect: { name: MODE_LABELS.intersect, description: MODE_DESCRIPTIONS.intersect, shortcuts: [{ keys: MODE_KEYS.intersect, label: 'Hold' }] },
};

const EXPAND_HINT: HintSpec = {
  name: 'Expand 1',
  description: 'Grow the selection by one pixel on every side.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.expand }],
};

const SHRINK_HINT: HintSpec = {
  name: 'Shrink 1',
  description: 'Shrink the selection by one pixel on every side.',
  shortcuts: [{ command: SELECTION_COMMAND_ID.shrink }],
};

const SCOPE_DESCRIPTION = 'The part of the file your edits change.';

const SCOPE_HINTS = {
  sprites: { name: 'Sprites', description: 'Choose which sprites your edits change.' },
  layers: { name: 'Layers', description: 'Choose which layers your edits change.' },
  frames: { name: 'Frames', description: 'Choose which frames your edits change.' },
} as const satisfies Record<string, HintSpec>;

export {
  BRUSH_SHAPE_HINTS, BRUSH_SHAPES, BRUSH_SIZE_HINT, CONTEXT_TEXT, EXPAND_HINT, FILL_HINTS, FILLED_HINT, MIRROR_HINTS, MIRROR_X_HINT, MIRROR_Y_HINT,
  MAP_TOOL_OPTIONS, NEIGHBOUR_CHOICES, NEIGHBOUR_HINTS, PIXEL_PERFECT_HINT, SCOPE_DESCRIPTION, SCOPE_HINTS, SELECT_MODE_HINTS, SELECT_VARIANT_HINTS, SHAPE_HINTS,
  SHRINK_HINT, TOOL_OPTIONS,
};
