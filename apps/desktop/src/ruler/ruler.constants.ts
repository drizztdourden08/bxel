/* @layer renderer-app @kind constants */
import type { RulerView } from './ruler.type';

const LABEL_BASES: readonly number[] = [1, 2, 5];

const LABEL_DECADES: readonly number[] = [1, 10, 100, 1000, 10000, 100000];

const LABEL_GAP = 48;

const MIN_ZOOM = 0.01;

const RULER_TOKENS = {
  ground: '--c-sunken',
  line: '--c-border',
  text: '--c-text-muted',
  cursor: '--c-danger',
  axis: '--c-tertiary',
} as const;

const RULER_SIZES = {
  font: 10,
  minorTick: 4,
  majorTick: 9,
  labelInset: 3,
  handleReach: 7,
  handleHalf: 5,
  handleHeight: 8,
} as const;

const CURSOR_ALPHA = 0.35;

const TEXT_DIGITS = 2;

const FALLBACK_FONT = 'sans-serif';

const EMPTY_RULER_VIEW: RulerView = { originX: 0, originY: 0, zoom: 1, width: 0, height: 0, imageWidth: 0, imageHeight: 0 };

const RULER_TEXT = {
  x: 'Horizontal ruler',
  y: 'Vertical ruler',
} as const;

export { CURSOR_ALPHA, EMPTY_RULER_VIEW, FALLBACK_FONT, LABEL_BASES, LABEL_DECADES, LABEL_GAP, MIN_ZOOM, RULER_SIZES, RULER_TEXT, RULER_TOKENS, TEXT_DIGITS };
