/* @layer renderer-app @kind constants */
import type { TileMode } from '../../stores/view-store.type';
import type { PixelTiling } from '../PixelViewport';

const EDITOR_CANVAS_TEXT = {
  label: 'Sprite canvas',
  empty: 'No sprite is open.',
} as const;

const CANVAS_CLASS = {
  plain: 'editor-canvas',
  rulers: 'editor-canvas editor-canvas--rulers',
  viewport: 'editor-canvas__viewport',
} as const;

const TILING_OF: Readonly<Record<TileMode, PixelTiling>> = {
  off: { x: false, y: false },
  x: { x: true, y: false },
  y: { x: false, y: true },
  both: { x: true, y: true },
};

const OVERLAY_TOKENS = {
  axis: '--c-tertiary',
  cursor: '--c-danger',
  ink: '--c-primary',
  ground: '--c-sunken',
} as const;

const OUTLINE_PATHS = new WeakMap<object, Path2D>();

const AREA_FILL_ALPHA = 0.25;

const AREA_LINE = 2;

const ANT_DASH = 4;

const ANT_PERIOD = 8;

const ANT_STEP_MS = 90;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const AXIS_GRAB = { across: 6, along: 14 } as const;

const AXIS_DASH: readonly number[] = [4, 3];

const AXIS_GRIP = 5;

export {
  ANT_DASH, ANT_PERIOD, ANT_STEP_MS, AREA_FILL_ALPHA, AREA_LINE, AXIS_DASH, AXIS_GRAB, AXIS_GRIP, CANVAS_CLASS, EDITOR_CANVAS_TEXT, OUTLINE_PATHS, OVERLAY_TOKENS,
  REDUCED_MOTION, TILING_OF,
};
