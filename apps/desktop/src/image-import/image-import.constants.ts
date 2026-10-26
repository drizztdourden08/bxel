/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { LIMIT_DEFAULT } from '../palette-limit/palette-limit.constants';
import { SOURCE_DEFAULT } from '../palette-source/palette-source.constants';
import type { ChoiceOption, DitherName, ImportForm, ImportKind, ImportStep, SliceForm } from './image-import.type';

const MAX_IMPORT_SPRITES = 128;

const BANK_REF = 'bank';

const ANIMATION_REF = 'animation';

const ALPHA_PERCENT_DEFAULT = 50;

const BYTE_MAX = 255;

const RGBA_BYTES = 4;

const SHIFT = { red: 16, green: 8 } as const;

const NAME_ROOM = 48;

const PERCENT = 100;

const DITHER_SIZE = { none: null, bayer2: 2, bayer4: 4, bayer8: 8 } as const;

const DITHER_CHOICES: ChoiceOption<DitherName>[] = [
  { value: 'none', label: 'None (default)' },
  { value: 'bayer2', label: 'Ordered 2 x 2' },
  { value: 'bayer4', label: 'Ordered 4 x 4' },
  { value: 'bayer8', label: 'Ordered 8 x 8' },
];

const SLICE_DEFAULT: SliceForm = {
  cellWidth: 16,
  cellHeight: 16,
  offsetX: 0,
  offsetY: 0,
  spacingX: 0,
  spacingY: 0,
  order: 'rows',
  names: '',
};

const FORM_BASE: ImportForm = {
  target: 'new',
  kind: 'sprite',
  name: '',
  reduce: null,
  dither: 'none',
  alphaPercent: ALPHA_PERCENT_DEFAULT,
  limit: LIMIT_DEFAULT,
  transparent: true,
  source: SOURCE_DEFAULT,
  slice: SLICE_DEFAULT,
};

const STEPS_BY_KIND: Readonly<Record<ImportKind, readonly ImportStep[]>> = {
  sprite: ['source', 'colors'],
  sheet: ['source', 'colors', 'slicing'],
  tiled: ['source', 'colors'],
  animation: ['source', 'colors'],
  strip: ['source', 'colors', 'slicing'],
};

const IMAGE_MIMES: readonly string[] = ['image/png', 'image/apng', 'image/gif'];

const IMAGE_EXTENSIONS: readonly string[] = ['.png', '.apng', '.gif'];

const IMAGE_FILTERS = [{ name: 'Image', extensions: ['png', 'apng', 'gif'] }];

const FALLBACK_SLOT = '#000000';

const IMPORT_TEXT = {
  title: (file: string): string => `Import image: ${file}`,
  steps: { source: 'Source', colors: 'Colours', slicing: 'Slicing' },
  stepsLabel: 'Import steps',
  target: 'Import into',
  newFile: 'New file',
  thisFile: 'This file',
  noFile: 'Open a file first to import into it.',
  kind: 'Import as',
  sprite: 'Sprite',
  sheet: 'Sheet',
  animationKind: 'Animation',
  name: 'Name',
  imageLine: (width: number, height: number): string => `Image ${width} x ${height} pixels`,
  tooLarge: (width: number, height: number): string =>
    `This image is ${width} x ${height}. The largest sprite is ${MAX_SPRITE_SIZE} x ${MAX_SPRITE_SIZE}.`,
  unreadable: 'Cannot read that file. Bxel imports PNG, GIF and APNG images.',
  tooMany: (count: number, limit: number): string =>
    `This image has ${count} colours. The limit is ${limit}. Choose how to reduce them before importing.`,
  original: (count: number): string => `Original, ${count} colours`,
  mapped: (used: number, opaque: number): string => `Palette-mapped, ${used} of ${opaque} opaque used`,
  noMapping: 'Choose how to reduce the colours to see the result.',
  reduce: 'Reduce colours',
  map: (name: string): string => `Map to this file palette (${name})`,
  extract: (count: number): string => `Extract the best ${count} colours`,
  palette: 'Use a palette file or preset',
  dither: 'Dithering',
  alpha: 'Partly transparent pixels',
  alphaHint: (percent: number): string => `Pixels ${percent}% opaque or more become opaque`,
  alphaLabel: 'Opaque from (percent)',
  advanced: 'Advanced',
  changed: (count: number): string => `${count} pixels change colour. No colours are added silently.`,
  unchanged: 'No pixel changes colour.',
  result: 'Result',
  back: 'Back',
  next: 'Next',
  nextSlicing: 'Next: Slicing',
  nextColors: 'Next: Colours',
  cancel: 'Cancel',
  importSprite: 'Import sprite',
  importSprites: (count: number): string => `Import ${count} sprites`,
  importAnimation: 'Import animation',
  cell: 'Cell size',
  offset: 'Offset',
  spacing: 'Spacing',
  order: 'Order',
  rowsOrder: 'Rows, left to right',
  columnsOrder: 'Columns, top to bottom',
  names: 'Names',
  namesHint: 'Use {n} for the number.',
  willCreate: (count: number, first: string, last: string): string =>
    count === 1 ? `1 sprite will be created: ${first}` : `${count} sprites will be created: ${first} to ${last}`,
  noCells: 'The grid has no cells. Make the cell size smaller or the offset lower.',
  tooManyCells: `A sheet import creates up to ${MAX_IMPORT_SPRITES} sprites. Make the cell size larger.`,
  negative: 'Offset and spacing cannot be negative.',
  width: 'Width',
  height: 'Height',
  x: 'X',
  y: 'Y',
  slicePreview: 'Numbered cells',
  reading: 'Reading image',
  failed: (reason: string): string => `Could not import the image. ${reason}`,
  imported: (names: readonly string[]): string =>
    names.length === 1 ? `Imported sprite ${names[0] ?? ''}.` : `Imported ${names.length} sprites.`,
  importedAnimation: (name: string, frames: number): string => `Imported animation ${name} with ${frames} frames.`,
  stripFrames: (frames: number, width: number, height: number): string => `${frames} frames of ${width} by ${height} pixels will be made.`,
  pickTitle: 'Import image',
  dropped: 'Drop a PNG, GIF or APNG image to import it.',
  animation: (frames: number): string => `Animation with ${frames} frames. Each picture becomes a frame with its own duration.`,
} as const;

const IMPORT_LABEL = {
  animation: 'Import animation',
  sprite: 'Import sprite',
  sprites: (count: number): string => `Import ${count} sprites`,
} as const;

export {
  ANIMATION_REF,
  BANK_REF,
  BYTE_MAX,
  DITHER_CHOICES,
  DITHER_SIZE,
  FALLBACK_SLOT,
  FORM_BASE,
  IMAGE_EXTENSIONS,
  IMAGE_FILTERS,
  IMAGE_MIMES,
  IMPORT_LABEL,
  IMPORT_TEXT,
  MAX_IMPORT_SPRITES,
  NAME_ROOM,
  PERCENT,
  RGBA_BYTES,
  SHIFT,
  STEPS_BY_KIND,
};
