/* @layer renderer-app @kind constants */
const MAP_TOKENS = {
  cursor: '--c-primary',
  erase: '--c-danger',
  select: '--c-tertiary',
  collision: '--c-warning',
} as const;

const MAP_CANVAS_CLASS = {
  surface: 'tilemap-canvas',
  viewport: 'tilemap-canvas__viewport',
} as const;

const GHOST_ALPHA = 0.6;

const SHADE_ALPHA = 0.18;

const COLLISION_ALPHA = 0.4;

const REGION_CELL_CAP = 4096;

const GRID_CELL_CAP = 40000;

const CELL_GRID_MIN = 6;

const CURSOR_LINE = 2;

const SELECT_DASH: readonly number[] = [4, 3];

export { CELL_GRID_MIN, COLLISION_ALPHA, CURSOR_LINE, GRID_CELL_CAP, REGION_CELL_CAP, GHOST_ALPHA, MAP_CANVAS_CLASS, MAP_TOKENS, SELECT_DASH, SHADE_ALPHA };
