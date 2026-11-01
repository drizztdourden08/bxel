/* @layer renderer-app @kind constants */
import type { CombineMode, Point } from '@bxel/raster';
import type { SelectVariant } from './selection.type';

const SELECT_VARIANTS: readonly SelectVariant[] = ['rect', 'ellipse', 'lasso', 'polygon', 'wand', 'colour'];

const SELECT_LABELS: Readonly<Record<SelectVariant, string>> = {
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  lasso: 'Lasso',
  polygon: 'Polygon',
  wand: 'Wand',
  colour: 'By colour',
};

const SELECT_MODES: readonly CombineMode[] = ['replace', 'add', 'subtract', 'intersect'];

const MODE_LABELS: Readonly<Record<CombineMode, string>> = {
  replace: 'Replace',
  add: 'Add',
  subtract: 'Subtract',
  intersect: 'Intersect',
};

const SELECTION_TEXT = {
  nothingSelected: 'Select some pixels first.',
  nothingToPaste: 'Copy a selection first.',
  nothingToAlign: 'Select some pixels first, then align them.',
  nothingToDistribute: 'Select three or more separate areas to space them out.',
  pastedCropped: 'The copied pixels were larger than this sprite, so the paste is cropped to fit.',
  pastedRemapped: 'The colours were matched to the nearest ones in this palette.',
  savedSizeChanged: (name: string): string => `The saved selection "${name}" was made for another canvas size.`,
} as const;

const SELECTION_LABELS = {
  cut: 'Cut',
  delete: 'Delete selection',
  fill: 'Fill selection',
  stroke: 'Stroke selection',
  align: 'Align',
  distribute: 'Distribute',
  guides: 'Selection to guides',
  pasteLayer: 'Paste as new layer',
  pasteSprite: 'Paste as new sprite',
  pastedName: 'Pasted',
  save: (name: string): string => `Save selection ${name}`,
  forget: (name: string): string => `Delete saved selection ${name}`,
} as const;

const NUDGE_STEP = 1;

const NUDGE_STEP_FAST = 8;

const POLYGON_MIN_VERTICES = 3;

const DOUBLE_CLICK = 2;

const ARROW_DELTAS: Readonly<Record<string, Point>> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

const NEW_SPRITE_REF = 'pasted';

export {
  ARROW_DELTAS, DOUBLE_CLICK, MODE_LABELS, NEW_SPRITE_REF, NUDGE_STEP, NUDGE_STEP_FAST, POLYGON_MIN_VERTICES, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS,
  SELECTION_LABELS, SELECTION_TEXT,
};
