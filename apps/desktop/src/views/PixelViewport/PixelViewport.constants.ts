/* @layer renderer-app @kind constants */
import type { PixelTiling } from './PixelViewport.type';
import type { ViewBox } from './behavior/viewport.type';

const PIXEL_ZOOM_STEPS: readonly number[] = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];

const PIXEL_GRID_FROM = 8;

const PIXEL_TOKENS = {
  checkA: '--c-checker-a',
  checkB: '--c-checker-b',
  grid: '--c-grid-line',
  check: '--checker-size',
  margin: '--size-32',
  step: '--size-32',
} as const;

const PIXEL_FALLBACK = {
  check: 8,
  margin: 32,
  step: 32,
} as const;

const EMPTY_BOX: ViewBox = { width: 0, height: 0, dpr: 1, margin: PIXEL_FALLBACK.margin, step: PIXEL_FALLBACK.step };

const WHEEL = {
  linePixels: 16,
  notch: 40,
  pinchStep: 60,
  lineMode: 1,
  pageMode: 2,
} as const;

const PAN_FAST = 4;

const NO_TILING: PixelTiling = { x: false, y: false };

const TILE_REACH = 32;

const SPACE_KEY = ' ';

const MIDDLE_BUTTON = 1;

const MAIN_BUTTON = 0;

const ANNOUNCE_DELAY_MS = 500;

const MAPPING_EPSILON = 1e-6;

const ZOOM_EPSILON = 1e-4;

const PIXEL_VIEWPORT_STRINGS = {
  role: 'pixel image',
  zoomLevel: (zoom: number) => `Zoom ${Math.round(zoom * 100)}%`,
};

export {
  ANNOUNCE_DELAY_MS, EMPTY_BOX, MAIN_BUTTON, MAPPING_EPSILON, MIDDLE_BUTTON, NO_TILING, PAN_FAST, PIXEL_FALLBACK, PIXEL_GRID_FROM, PIXEL_TOKENS,
  PIXEL_VIEWPORT_STRINGS, PIXEL_ZOOM_STEPS, SPACE_KEY, TILE_REACH, WHEEL, ZOOM_EPSILON,
};
