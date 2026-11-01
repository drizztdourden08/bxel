/* @layer renderer-app @kind constants */
import { SELECT_VARIANT_ICONS } from '../../icons/tool-icons.constants';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../selection/selection.constants';
import { CONNECTIVITY_DESCRIPTIONS, FILL_DESCRIPTIONS, MODE_DESCRIPTIONS, MODE_KEYS, SELECT_DESCRIPTIONS } from '../tool-descriptions.constants';
import { FILL_LABELS, FILL_MODES } from '../tools.constants';
import type { OptionChoice } from './tool-options.type';

const OPTION_TEXT = {
  size: 'Brush size',
  sizeDescription: 'How many pixels wide the brush is.',
  tip: 'Brush tip',
  tipDescription: 'The shape of the brush.',
  angle: 'Line angle',
  angleDescription: 'The angle of the line brush: 0 across, 45 climbing to the right, 90 down, 135 falling to the right.',
  pixelPerfect: 'Pixel perfect',
  pixelPerfectDescription: 'Drop the extra corner pixels that make a freehand line look thick.',
  fillArea: 'Fill area',
  fillAreaDescription: 'Fill the pixels that touch the one you click, or every pixel of its colour.',
  neighbours: 'Fill neighbours',
  neighboursDescription: 'Whether pixels that only touch at a corner count as neighbours.',
  filled: 'Filled',
  filledDescription: 'Fill the inside of rectangles and ellipses.',
  linesHaveNoInside: 'Lines have no inside.',
  selectShape: 'Selection shape',
  selectShapeDescription: 'How a drag turns into a selection.',
  selectMode: 'Selection mode',
  selectModeDescription: 'How a new selection joins the old one.',
  wandNeighbours: 'Wand neighbours',
  wandNeighboursDescription: 'Whether the wand also follows pixels that touch at a corner.',
  sampleSource: 'Sample from',
  sampleSourceDescription: 'Which pixels the wand and Select by colour look at: the active layer, or the picture as it shows with every visible layer.',
  matchMode: 'Match',
  matchModeDescription: 'Which pixels the wand and Select by colour take: the same colour, the same ramp, or colours within a distance.',
  distance: 'Distance',
  distanceDescription: 'How far apart two palette colours may be, from 0 to 255, and still match.',
  ignoreTransparent: 'Ignore transparent',
  ignoreTransparentDescription: 'Never take transparent pixels, even when they match.',
  inSelection: 'In selection only',
  inSelectionDescription: 'Only take pixels inside the selection that exists now.',
  amount: 'Amount',
  amountDescription: 'How many pixels Expand, Shrink and Border change the selection by.',
  expand: 'Expand',
  expandDescription: 'Grow the selection by one pixel on every side.',
  shrink: 'Shrink',
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
  mapSelectShape: 'Select by',
  mapSelectShapeDescription: 'How a click or drag turns into a selection of cells.',
  sameTile: 'Match tile',
  sameTileDescription: 'Select every cell on the layer that holds the tile of the first selected cell.',
  stamp: 'Take stamp',
  stampDescription: 'Make the selected cells the stamp, so the Place tool puts the same block, with its turns, anywhere.',
} as const;

const BRUSH_TIP_CHOICES: readonly OptionChoice[] = [
  { value: 'square', label: 'Square', description: 'Paint with a square brush tip.', icon: 'pixel-brush-square' },
  { value: 'circle', label: 'Circle', description: 'Paint with a round brush tip.', icon: 'pixel-brush-circle' },
  { value: 'line', label: 'Line', description: 'Paint with a one pixel line at an angle. The size is its length.', icon: 'pixel-shape-line' },
];

const BRUSH_ANGLE_CHOICES: readonly OptionChoice[] = ['0', '45', '90', '135'].map((value) => ({
  value,
  label: `Line angle ${value} degrees`,
  description: 'The angle of the line brush. 0 is across, 90 is down, 45 climbs to the right.',
  glyph: value,
}));

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

const MATCH_CHOICES: readonly OptionChoice[] = [
  { value: 'exact', label: 'Same colour', description: 'Only pixels of exactly the picked colour.', glyph: '=' },
  { value: 'ramp', label: 'Same ramp', description: 'Pixels of any colour that shares a ramp with the picked colour.', glyph: 'R' },
  { value: 'similar', label: 'Similar colour', description: 'Pixels whose colour lies within the distance of the picked colour.', glyph: '~' },
];

const SAMPLE_CHOICES: readonly OptionChoice[] = [
  { value: 'layer', label: 'Active layer', description: 'Look at the active layer only.', glyph: 'L' },
  { value: 'visible', label: 'All visible layers', description: 'Look at the flattened picture, every visible layer.', glyph: 'V' },
];

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

const MAP_SELECT_SHAPE_CHOICES: readonly OptionChoice[] = [
  { value: 'rect', label: 'Rectangle', description: 'Drag a rectangle of cells.', icon: 'pixel-select-rect' },
  { value: 'wand', label: 'Wand', description: 'Click a cell to select the connected cells that hold the same tile with the same turn.', icon: 'pixel-map-wand' },
  { value: 'same', label: 'Same tile', description: 'Click a cell to select every cell of the layer that holds its tile, whatever its turn.', icon: 'pixel-map-same-tile' },
];

export { BRUSH_ANGLE_CHOICES, BRUSH_TIP_CHOICES, FILL_AREA_CHOICES, MAP_SELECT_SHAPE_CHOICES, MATCH_CHOICES, NEIGHBOUR_CHOICES, OPTION_TEXT, SAMPLE_CHOICES, SELECT_MODE_CHOICES, SELECT_SHAPE_CHOICES };
