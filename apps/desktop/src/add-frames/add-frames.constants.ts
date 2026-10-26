/* @layer renderer-app @kind constants */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import type { FrameMode, StripResult, StripSpec } from './add-frames.type';

const STRIP_START: StripSpec = { by: 'count', columns: 4, rows: 1, cellWidth: 16, cellHeight: 16 };

const DURATION_START = DEFAULT_FRAME_DURATION_MS;

const ADD_TEXT = {
  menu: 'Add frames from',
  blank: 'Blank frame',
  duplicate: 'Copy of the picked frames',
  fromSprites: 'Sprites...',
  fromStrip: 'A strip...',
  fromSheet: 'A sheet...',
  spritesTitle: 'Add frames from sprites',
  stripTitle: 'Add frames from a strip',
  sheetTitle: 'Add frames from a sheet',
  add: 'Add frames',
  cancel: 'Cancel',
  pickSprites: 'Sprites to add, in order',
  pickSprite: 'Strip sprite',
  pickSheet: 'Sheet',
  noSprites: 'No sprite of this palette is in the file yet.',
  noSheets: 'No sheet holds a sprite of this palette.',
  otherPalette: (count: number): string => (count === 1 ? '1 sprite uses another palette and is not listed.' : `${count} sprites use another palette and are not listed.`),
  mode: 'Use the sprites',
  reference: 'As they are',
  referenceHint: 'A change to a sprite shows in the animation.',
  copy: 'As copies',
  copyHint: 'The animation gets its own pixels.',
  duration: 'Frame duration in milliseconds',
  by: 'Cut by',
  byCount: 'Number of cells',
  bySize: 'Size of a cell',
  columns: 'Columns',
  rows: 'Rows',
  cellWidth: 'Cell width',
  cellHeight: 'Cell height',
  result: 'Frames',
  cells: 'Use cells of the strip',
  cellsHint: 'Each frame shows one cell of the strip. No pixels are copied.',
  cut: 'Cut into sprites',
  cutHint: 'Each cell becomes a sprite of its own and the frame shows it.',
  willAdd: (frames: number, width: number, height: number): string => `${frames} frames of ${width} by ${height} pixels will be added.`,
  willAddSprites: (frames: number): string => (frames === 1 ? '1 frame will be added.' : `${frames} frames will be added.`),
  pickOne: 'Pick at least one sprite.',
  unavailable: 'Open an animation first.',
} as const;

const MODE_OPTIONS: readonly { value: FrameMode; label: string; description: string }[] = [
  { value: 'reference', label: ADD_TEXT.reference, description: ADD_TEXT.referenceHint },
  { value: 'copy', label: ADD_TEXT.copy, description: ADD_TEXT.copyHint },
];

const RESULT_OPTIONS: readonly { value: StripResult; label: string; description: string }[] = [
  { value: 'cells', label: ADD_TEXT.cells, description: ADD_TEXT.cellsHint },
  { value: 'cut', label: ADD_TEXT.cut, description: ADD_TEXT.cutHint },
];

const BY_OPTIONS = [
  { value: 'count', label: ADD_TEXT.byCount },
  { value: 'size', label: ADD_TEXT.bySize },
] as const;

export { ADD_TEXT, BY_OPTIONS, DURATION_START, MODE_OPTIONS, RESULT_OPTIONS, STRIP_START };
