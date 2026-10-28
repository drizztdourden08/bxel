/* @layer renderer-app @kind constants */
import { SELECT_VARIANT_ICONS, SHAPE_KIND_ICONS } from '../../icons/tool-icons.constants';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../selection/selection.constants';
import { CONNECTIVITY_DESCRIPTIONS, FILL_DESCRIPTIONS, MODE_DESCRIPTIONS, MODE_KEYS, SELECT_DESCRIPTIONS, SHAPE_DESCRIPTIONS } from '../tool-descriptions.constants';
import { FILL_LABELS, FILL_MODES, SHAPE_KINDS, SHAPE_LABELS } from '../tools.constants';
import type { OptionChoice } from './tool-options.type';

const OPTION_TEXT = {
  size: 'Brush size',
  sizeDescription: 'How many pixels wide the brush is.',
  tip: 'Brush tip',
  tipDescription: 'The shape of the brush.',
  pixelPerfect: 'Pixel perfect',
  pixelPerfectDescription: 'Drop the extra corner pixels that make a freehand line look thick.',
  fillArea: 'Fill area',
  fillAreaDescription: 'Fill the pixels that touch the one you click, or every pixel of its colour.',
  neighbours: 'Fill neighbours',
  neighboursDescription: 'Whether pixels that only touch at a corner count as neighbours.',
  shapeKind: 'Shape kind',
  shapeKindDescription: 'Draw a line, a rectangle or an ellipse.',
  filled: 'Filled',
  filledDescription: 'Fill the inside of rectangles and ellipses.',
  linesHaveNoInside: 'Lines have no inside.',
  selectShape: 'Selection shape',
  selectShapeDescription: 'How a drag turns into a selection.',
  selectMode: 'Selection mode',
  selectModeDescription: 'How a new selection joins the old one.',
  wandNeighbours: 'Wand neighbours',
  wandNeighboursDescription: 'Whether the wand also follows pixels that touch at a corner.',
  expand: 'Expand 1',
  expandDescription: 'Grow the selection by one pixel on every side.',
  shrink: 'Shrink 1',
  shrinkDescription: 'Shrink the selection by one pixel on every side.',
  flipX: 'Flip X',
  flipXDescription: 'Mirror the tile left to right. With a selection it turns the selected cells, else the tile you place.',
  flipY: 'Flip Y',
  flipYDescription: 'Mirror the tile top to bottom. With a selection it turns the selected cells, else the tile you place.',
  turn: 'Rotate 90',
  turnDescription: 'Rotate the tile a quarter turn clockwise. It needs square tiles.',
  terrain: 'Terrain brush',
  terrainDescription: 'Paint and erase with the terrain rules of the tileset, so the tiles join their neighbours.',
  mapFilledDescription: 'Fill the inside of the rectangle. Off draws only the outline.',
  replaceIn: 'In selection',
  replaceInDescription: 'Swap the tile in the first selected cell for the picked tile, inside the selection only.',
  replaceAll: 'Everywhere',
  replaceAllDescription: 'Swap the tile in the first selected cell for the picked tile on the whole layer.',
  unique: 'Unique',
  uniqueDescription: 'Give the selected cells their own copy of their tile, so editing it leaves other cells alone.',
  clear: 'Clear',
  clearDescription: 'Empty the selected cells. The tiles stay in the tileset.',
  needSelection: 'Select some cells first.',
} as const;

const BRUSH_TIP_CHOICES: readonly OptionChoice[] = [
  { value: 'square', label: 'Square', description: 'Paint with a square brush tip.', icon: 'pixel-brush-square' },
  { value: 'circle', label: 'Circle', description: 'Paint with a round brush tip.', icon: 'pixel-brush-circle' },
];

const FILL_AREA_CHOICES: readonly OptionChoice[] = FILL_MODES.map((mode) => ({
  value: mode,
  label: FILL_LABELS[mode],
  description: FILL_DESCRIPTIONS[mode],
  icon: mode === 'global' ? 'pixel-fill-global' : 'pixel-fill-bucket',
}));

const NEIGHBOUR_CHOICES: readonly OptionChoice[] = [
  { value: '4', label: '4 neighbours', description: CONNECTIVITY_DESCRIPTIONS[4], glyph: '4' },
  { value: '8', label: '8 neighbours', description: CONNECTIVITY_DESCRIPTIONS[8], glyph: '8' },
];

const SHAPE_KIND_CHOICES: readonly OptionChoice[] = SHAPE_KINDS.map((kind) => ({
  value: kind,
  label: SHAPE_LABELS[kind],
  description: SHAPE_DESCRIPTIONS[kind],
  icon: SHAPE_KIND_ICONS[kind],
}));

const SELECT_SHAPE_CHOICES: readonly OptionChoice[] = SELECT_VARIANTS.map((variant) => ({
  value: variant,
  label: SELECT_LABELS[variant],
  description: SELECT_DESCRIPTIONS[variant],
  icon: SELECT_VARIANT_ICONS[variant],
}));

const MODE_ICONS = { replace: 'pixel-select-rect', add: 'plus', subtract: 'x', intersect: 'circle-dot' } as const;

const SELECT_MODE_CHOICES: readonly OptionChoice[] = SELECT_MODES.map((mode) => ({
  value: mode,
  label: MODE_LABELS[mode],
  description: MODE_DESCRIPTIONS[mode],
  icon: MODE_ICONS[mode],
  keys: MODE_KEYS[mode].length > 0 ? MODE_KEYS[mode] : undefined,
}));

export { BRUSH_TIP_CHOICES, FILL_AREA_CHOICES, NEIGHBOUR_CHOICES, OPTION_TEXT, SELECT_MODE_CHOICES, SELECT_SHAPE_CHOICES, SHAPE_KIND_CHOICES };
