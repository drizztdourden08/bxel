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
  tooLarge: 'The copied pixels are larger than this sprite.',
} as const;

const SELECTION_LABELS = {
  cut: 'Cut',
  delete: 'Delete selection',
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

export {
  ARROW_DELTAS, DOUBLE_CLICK, MODE_LABELS, NUDGE_STEP, NUDGE_STEP_FAST, POLYGON_MIN_VERTICES, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS,
  SELECTION_LABELS, SELECTION_TEXT,
};
