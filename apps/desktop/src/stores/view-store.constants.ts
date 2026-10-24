/* @layer renderer-app @kind constants */
import type { TileMode, ViewSettings } from './view-store.type';

const VIEW_DEFAULTS: ViewSettings = { grid: true, tiled: 'off', viewport: null };

const TILE_MODES: readonly TileMode[] = ['off', 'x', 'y', 'both'];

const TILE_LABELS: Readonly<Record<TileMode, string>> = {
  off: 'Off',
  x: 'Horizontal',
  y: 'Vertical',
  both: 'Both',
};

export { TILE_LABELS, TILE_MODES, VIEW_DEFAULTS };
