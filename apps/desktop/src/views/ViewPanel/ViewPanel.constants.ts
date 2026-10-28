/* @layer renderer-app @kind constants */
import type { TileMode } from '../../stores/view-store.type';
import type { OnionTint } from '../../stores/timeline-store.type';
import type { RulerUnit } from '../../ruler/ruler-unit.type';

const VIEW_PANEL_TEXT = {
  region: 'View',
  empty: 'Open an asset to use the view controls.',
  navigator: 'Navigator',
  zoom: 'Zoom',
  overlays: 'Overlays',
  onion: 'Onion skin',
  tiled: 'Tiled preview',
  symmetry: 'Symmetry',
  background: 'Background',
} as const;

const OVERLAY_TEXT = {
  lines: 'Lines',
  grids: 'Grids',
  helpers: 'Helpers',
  majorEvery: 'Major line every',
  tileSize: 'Tile grid size',
  tileWidth: 'Tile width',
  tileHeight: 'Tile height',
  pixels: 'px',
  reset: 'Use the default',
  rulerUnit: 'Ruler unit',
  cellGrid: 'Cell grid',
  collision: 'Collision shapes',
  collisionDescription: 'Outline the collision shape of each tile on the map.',
  animate: 'Animate tiles',
  animateDescription: 'Play the tile animations on the map.',
  snap: 'Snap',
  snapDescription: 'Moves, shapes and guides land on the grid lines.',
} as const;

const RULER_UNIT_NAMES: Readonly<Record<RulerUnit, string>> = { pixels: 'Pixels', tiles: 'Tiles', percent: 'Percent' };

const ONION_TEXT = {
  show: 'Show onion skin',
  before: 'Frames before',
  after: 'Frames after',
  opacity: 'Opacity',
  tint: 'Tint',
} as const;

const ONION_TINTS: Readonly<Record<OnionTint, { label: string; swatches: readonly string[] }>> = {
  none: { label: 'Natural', swatches: [] },
  split: { label: 'Red and blue', swatches: ['#e5484d', '#3e63dd'] },
  grey: { label: 'Grey', swatches: ['#8b8d98'] },
};

const TILED_TEXT = { mode: 'Repeat the canvas', hint: 'Check that a pattern joins without a seam.' } as const;

const TILED_ORDER: readonly TileMode[] = ['off', 'x', 'y', 'both'];

const SYMMETRY_TEXT = {
  mirrorX: 'Mirror X',
  mirrorY: 'Mirror Y',
  centre: 'Centre',
  centred: 'Centred',
  at: (value: number): string => `At ${value}`,
  centreLabel: (axis: string): string => `Centre the ${axis} axis`,
} as const;

const BACKGROUND_TEXT = {
  kind: 'Behind the art',
  colour: 'Game colour',
  colourButton: 'Pick the colour',
  hint: 'Only for this asset. It is never exported.',
  reset: 'Reset view',
} as const;

export { BACKGROUND_TEXT, ONION_TEXT, ONION_TINTS, OVERLAY_TEXT, RULER_UNIT_NAMES, SYMMETRY_TEXT, TILED_ORDER, TILED_TEXT, VIEW_PANEL_TEXT };
