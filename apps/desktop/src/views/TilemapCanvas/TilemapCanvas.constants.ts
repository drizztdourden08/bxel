/* @layer renderer-app @kind constants */
const MAP_TOKENS = {
  cursor: '--c-primary',
  erase: '--c-danger',
  select: '--c-tertiary',
} as const;

const MAP_CANVAS_CLASS = {
  surface: 'tilemap-canvas',
  viewport: 'tilemap-canvas__viewport',
} as const;

const GHOST_ALPHA = 0.6;

const SHADE_ALPHA = 0.18;

const CELL_GRID_MIN = 6;

const CURSOR_LINE = 2;

const SELECT_DASH: readonly number[] = [4, 3];

export { CELL_GRID_MIN, CURSOR_LINE, GHOST_ALPHA, MAP_CANVAS_CLASS, MAP_TOKENS, SELECT_DASH, SHADE_ALPHA };
