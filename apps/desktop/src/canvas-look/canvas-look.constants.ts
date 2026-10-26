/* @layer renderer-app @kind constants */
import type { CanvasSettings, CheckerPreset, NumberRange, PreviewSample, SurroundKind } from './canvas-look.type';

const PATTERN_SIZE = 16;

const PATTERN_CELLS = PATTERN_SIZE * PATTERN_SIZE;

const BLANK_PATTERN = '0'.repeat(PATTERN_CELLS);

const DITHER_PATTERN = ('10'.repeat(PATTERN_SIZE / 2) + '01'.repeat(PATTERN_SIZE / 2)).repeat(PATTERN_SIZE / 2);

const CANVAS_DEFAULTS: CanvasSettings = {
  canvasRightClick: 'back-colour',
  checkerA: '#b4b0c2',
  checkerB: '#8c8899',
  checkerPreset: '8',
  checkerSize: 8,
  surroundPattern: 'diagonal',
  surroundA: '#140b26',
  surroundB: '#1b1033',
  surroundScale: 2,
  surroundCustom: DITHER_PATTERN,
  gridPixel: true,
  gridColor: '#ffffff',
  gridOpacity: 0.15,
  gridMajor: false,
  gridMajorEvery: 8,
  gridMajorColor: '#ffffff',
  gridMajorOpacity: 0.35,
  gridTile: false,
  gridTileSize: 16,
  gridTileColor: '#46c8ff',
  gridTileOpacity: 0.6,
  rulers: true,
  rulerUnit: 'pixels',
};

const SURROUND_RULES: Readonly<Record<Exclude<SurroundKind, 'custom'>, (x: number, y: number) => boolean>> = {
  diagonal: (x, y) => (x + y) % 4 < 2,
  horizontal: (_x, y) => y % 4 < 2,
  vertical: (x) => x % 4 < 2,
  dots: (x, y) => x % 4 === 0 && y % 4 === 0,
  solid: () => false,
};

const SURROUND_KINDS: readonly SurroundKind[] = ['diagonal', 'horizontal', 'vertical', 'dots', 'solid', 'custom'];

const SURROUND_LABELS: Readonly<Record<SurroundKind, string>> = {
  diagonal: 'Diagonal stripes',
  horizontal: 'Horizontal stripes',
  vertical: 'Vertical stripes',
  dots: 'Dots',
  solid: 'Solid',
  custom: 'Custom',
};

const CHECKER_PRESETS: readonly CheckerPreset[] = ['4', '8', '16', '32', 'custom'];

const CHECKER_PRESET_LABELS: Readonly<Record<CheckerPreset, string>> = {
  '4': '4 px',
  '8': '8 px',
  '16': '16 px',
  '32': '32 px',
  custom: 'Custom',
};

const RANGES: Readonly<Record<'checkerSize' | 'surroundScale' | 'major' | 'tile' | 'opacity', NumberRange>> = {
  checkerSize: { min: 1, max: 64 },
  surroundScale: { min: 1, max: 8 },
  major: { min: 2, max: 256 },
  tile: { min: 2, max: 1024 },
  opacity: { min: 0, max: 1 },
};

const COLOUR_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const PREVIEW_INSET = { width: 0.4, height: 0.5 } as const;

const PREVIEW_SAMPLES: readonly PreviewSample[] = [
  { x: 0.12, y: 0.2, width: 0.3, height: 0.6, colour: '#e0475b', alpha: 1 },
  { x: 0.46, y: 0.3, width: 0.3, height: 0.5, colour: '#3aa0ff', alpha: 0.5 },
];

const PALETTE_COLUMNS = 16;

const PATTERN_GRID_ALPHA = 0.25;

const PATTERN_MARK_ALPHA = 0.35;

const PREVIEW_ZOOM = 6;

const CELL_STEPS: Readonly<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const MAJOR_MIN_GAP = 8;

const TILE_MIN_GAP = 8;

export {
  BLANK_PATTERN, CANVAS_DEFAULTS, CELL_STEPS, CHECKER_PRESET_LABELS, CHECKER_PRESETS, COLOUR_PATTERN, MAJOR_MIN_GAP, PALETTE_COLUMNS, PATTERN_CELLS, PATTERN_GRID_ALPHA, PATTERN_MARK_ALPHA, PATTERN_SIZE,
  PREVIEW_INSET, PREVIEW_SAMPLES, PREVIEW_ZOOM, RANGES, SURROUND_KINDS, SURROUND_LABELS, SURROUND_RULES, TILE_MIN_GAP,
};
