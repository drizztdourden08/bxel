/* @layer renderer-app @kind constants */
import type { PaletteSortKey } from '@bxel/palette';
import type { SegmentOption, TableAlign } from '@drizztdourden08/tessera';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { PaletteViewKind } from '../../palette-view/palette-view.type';
import type { HintSpec } from '../ActionHint';
import type { EditorModel, HeldChipDef, ListColumn } from './PalettePanel.type';

const PALETTE_PANEL_TEXT = {
  empty: 'No palette is open.',
  emptyHint: 'Open a sprite or make a new one to pick colours.',
  open: 'Open...',
  create: 'New sprite...',
  noColours: 'This palette has no colours yet.',
  grid: 'Palette swatches',
  list: 'Palette swatch list',
  held: 'Colours to draw with',
  name: (label: string, marks: readonly number[], use: string): string => {
    const held = marks.length === 0 ? '' : `, colour ${marks.join(' and ')}`;
    return `${label}${held}${use === '' ? '' : `, ${use}`}`;
  },
  use: (pixels: number, frames: number): string => (pixels === 0 ? 'unused' : `${pixels} ${pixels === 1 ? 'pixel' : 'pixels'} in ${frames} ${frames === 1 ? 'frame' : 'frames'}`),
  chip: (position: number, label: string): string => `Colour ${position}, ${label}`,
  chipEmpty: (position: number): string => `Colour ${position}, none`,
  chipPast: (position: number, index: number): string => `Colour ${position}, swatch ${index} is past the colour limit`,
  chipName: (position: number): string => `Colour ${position}`,
  chipIndex: (index: number): string => `#${index}`,
  swap: 'Swap colours 1 and 2',
  swapPairs: 'Swap colour pairs',
  add: 'Add colour',
  addHint: 'Adds a swatch next to colour 1 and opens the colour editor.',
  limit: (used: number, cap: number): string => `${used} / ${cap}`,
  limitName: (used: number, cap: number): string => `${used} of ${cap} colours used. Change colour limit`,
  shared: (count: number): string => `Shared by ${count} sprites. Edits recolour all of them.`,
  detach: 'Detach',
  showSprites: 'Show sprites',
  unused: (count: number): string => `${count} unused`,
  duplicates: (count: number): string => (count === 1 ? '1 duplicate' : `${count} duplicates`),
  switcher: 'Palette of this sprite',
  colours: (count: number): string => (count === 1 ? '1 colour' : `${count} colours`),
  overflow: 'More palette actions',
  views: 'Palette view',
  noRamps: 'No ramps yet. Select swatches and choose Make ramp, or build one with New ramp.',
  notInRamp: 'Not in a ramp',
  rampActions: (name: string): string => `Actions for ramp ${name}`,
  filter: 'Filter by name or hex',
  applyOrder: 'Apply this order',
  rename: (index: number): string => `Rename swatch ${index}`,
} as const;

const PALETTE_MENU_ZONE = 'palette';

const SWATCH_SELECTOR = '[data-swatch-index]';

const PALETTE_MENU = {
  label: 'Palette actions',
  swatch: (label: string): string => `Actions for ${label}`,
  useAs: (position: number): string => `Use as colour ${position}`,
  edit: 'Edit colour...',
  select: 'Select pixels of this colour',
  copy: 'Copy hex',
  merge: 'Merge into another swatch...',
  remove: 'Delete swatch...',
  reveal: 'Show in the palette',
  settings: 'Palette settings',
  transparent: 'The transparent swatch has no colour value.',
  fixed: 'The first swatch is fixed.',
  emptyChip: 'This colour holds no swatch.',
  newRamp: 'New ramp...',
  newRampFrom: 'New ramp from this...',
  makeRamp: 'Make ramp',
  makeRampLight: 'Make ramp by lightness',
  gradient: 'Gradient between...',
  sortSelection: 'Sort selection by lightness',
  addColour: 'Add colour',
  removeUnused: 'Remove unused...',
  unite: 'Unite duplicates...',
  locked: 'The palette is locked by its platform rules.',
} as const;

const RAMP_ROW_TEXT = {
  rename: 'Rename',
  reverse: 'Reverse',
  select: 'Select its swatches',
  sort: 'Sort by lightness',
  remove: 'Delete ramp',
  steps: (count: number): string => (count === 1 ? '1 step' : `${count} steps`),
  sphere: (name: string): string => `Shaded sphere test of ${name}`,
  name: (name: string): string => `Name of ramp ${name}`,
  newRamp: 'New ramp...',
  drop: 'Drop a swatch here to add it to the ramp. Hold Ctrl to keep it in its first ramp too.',
} as const;

const OVERFLOW_TEXT = {
  sort: 'Sort',
  sortDown: 'Sort descending',
  findUnused: 'Find unused',
  showUse: 'Show use',
  scope: 'Count use in',
  scopeSprite: 'This sprite',
  scopePalette: 'Every sprite on this palette',
  size: 'Swatch size',
  sizeOf: (size: number): string => `${size} pixels`,
} as const;

const VIEW_OPTIONS: SegmentOption<PaletteViewKind>[] = [
  { value: 'grid', icon: 'pixel-grid-view', hint: { label: 'Grid', description: 'Every swatch as a tile, in slot order.' } },
  { value: 'list', icon: 'pixel-list-view', hint: { label: 'List', description: 'One row per swatch with its name, hex, alpha and use.' } },
  { value: 'ramps', icon: 'pixel-shade', hint: { label: 'Ramps', description: 'The ramps of this palette as rows, for shading.' } },
];

const LIST_COLUMNS: readonly { key: ListColumn; label: string; align: TableAlign }[] = [
  { key: 'index', label: '#', align: 'left' },
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'hex', label: 'Hex', align: 'left' },
  { key: 'alpha', label: 'Alpha', align: 'right' },
  { key: 'use', label: 'Use', align: 'right' },
  { key: 'ramp', label: 'Ramp', align: 'left' },
];

const SORT_KEYS: readonly { key: PaletteSortKey; label: string }[] = [
  { key: 'lightness', label: 'Lightness' },
  { key: 'luminance', label: 'Luminance' },
  { key: 'hue', label: 'Hue' },
  { key: 'chroma', label: 'Chroma' },
  { key: 'name', label: 'Name' },
  { key: 'use', label: 'Use count' },
  { key: 'ramp', label: 'By ramp' },
];

const CONFIG_HINT: HintSpec = {
  name: 'Palette settings',
  description: 'Open the Asset settings on the palette: choose the palette, load a swatch set and set the platform rules for this file.',
};

const HELD_CHIPS: readonly HeldChipDef[] = [
  { slot: 'foreground', position: 1, draw: { mouse: 'left' }, pick: { mouse: 'left' } },
  { slot: 'background', position: 2, draw: { mouse: 'right' }, pick: { mouse: 'right' } },
  { slot: 'third', position: 3, draw: { keys: ['ctrl'], mouse: 'left' }, pick: { keys: ['shift'], mouse: 'left' } },
  { slot: 'fourth', position: 4, draw: { keys: ['ctrl'], mouse: 'right' }, pick: { keys: ['shift'], mouse: 'right' } },
];

const swatchHint = (label: string, use: string): HintSpec => ({
  name: label,
  description: use === '' ? 'Choose this colour for drawing. Double click to change its colour.' : `${use}. Double click to change its colour.`,
  shortcuts: [
    { label: 'Colour 1', mouse: 'left' },
    { label: 'Colour 2', mouse: 'right' },
    { label: 'Colour 3', keys: ['shift'], mouse: 'left' },
    { label: 'Colour 4', keys: ['shift'], mouse: 'right' },
    { label: 'Add to the selection', keys: ['ctrl'], mouse: 'left' },
    { label: 'Move the swatch', keys: ['alt'], mouse: 'left' },
  ],
});

const chipHint = (chip: HeldChipDef): HintSpec => ({
  name: PALETTE_PANEL_TEXT.chipName(chip.position),
  description: 'A colour to draw with. Click it to change the colour itself. Drop a swatch here to hold it.',
  shortcuts: [
    { label: 'Draw with it', keys: chip.draw.keys, mouse: chip.draw.mouse },
    { label: 'Pick it', keys: chip.pick.keys, mouse: chip.pick.mouse },
    { label: 'Swap pairs', command: COMMAND_ID.swapColourPairs },
  ],
});

const DIGIT_SLOTS: Readonly<Record<string, number>> = { '1': 0, '2': 1, '3': 2, '4': 3, Enter: 0 };

const PAGE_ROWS = 4;

const RAMP_DRAG_TYPE = 'application/x-bxel-ramp-swatch';

const STRIP_LENGTH = 8;

const CHANNEL_STOPS = 9;

const CHANNEL_TOP = 255;

const PERCENT = 100;

const OKLCH_RANGE = { l: 1, c: 0.37, h: 360 } as const;

const EDITOR_TEXT = {
  title: (index: number): string => `Swatch ${index}`,
  dialog: (index: number): string => `Edit the colour of swatch ${index}`,
  models: 'Colour model',
  before: 'Before',
  after: 'After',
  hex: 'Hex',
  name: 'Name',
  alpha: 'Alpha',
  lightness: 'Lightness',
  chroma: 'Chroma',
  hue: 'Hue',
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  same: (index: number): string => `Same as swatch ${index}.`,
  merge: (index: number): string => `Merge into ${index}`,
  reset: 'Reset',
  cancel: 'Cancel',
  done: 'Done',
} as const;

const EDITOR_MODELS: SegmentOption<EditorModel>[] = [
  { value: 'hsv', label: 'HSV' },
  { value: 'oklch', label: 'OKLCH' },
  { value: 'rgb', label: 'RGB' },
];

const RGB_CHANNELS: readonly string[] = [EDITOR_TEXT.red, EDITOR_TEXT.green, EDITOR_TEXT.blue];

export {
  CHANNEL_STOPS, CHANNEL_TOP, chipHint, CONFIG_HINT, EDITOR_MODELS, EDITOR_TEXT, DIGIT_SLOTS, HELD_CHIPS, LIST_COLUMNS, OKLCH_RANGE, OVERFLOW_TEXT, PAGE_ROWS, PALETTE_MENU, PERCENT, PALETTE_MENU_ZONE, PALETTE_PANEL_TEXT, RAMP_DRAG_TYPE, RAMP_ROW_TEXT, RGB_CHANNELS, SORT_KEYS, STRIP_LENGTH, SWATCH_SELECTOR, swatchHint, VIEW_OPTIONS,
};
