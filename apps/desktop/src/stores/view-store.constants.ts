/* @layer renderer-app @kind constants */
import { COMMAND_ID } from '../keymap/keymap.constants';
import type { TileMode, ViewSettings, ViewToggleRow } from './view-store.type';

const VIEW_DEFAULTS: ViewSettings = { grid: true, gridMajor: false, gridTile: false, guides: true, rulers: true, tiled: 'off', viewport: null };

const TILE_MODES: readonly TileMode[] = ['off', 'x', 'y', 'both'];

const TILE_LABELS: Readonly<Record<TileMode, string>> = {
  off: 'Off',
  x: 'Horizontal',
  y: 'Vertical',
  both: 'Both',
};

const VIEW_TOGGLE_ROWS: readonly ViewToggleRow[] = [
  { toggle: 'grid', command: COMMAND_ID.pixelGrid, label: 'Pixel grid', chord: "Mod+'" },
  { toggle: 'gridMajor', command: COMMAND_ID.majorGrid, label: 'Major grid' },
  { toggle: 'gridTile', command: COMMAND_ID.tileGrid, label: 'Tile grid' },
  { toggle: 'guides', command: COMMAND_ID.guides, label: 'Guides' },
  { toggle: 'rulers', command: COMMAND_ID.rulers, label: 'Rulers' },
];

export { TILE_LABELS, TILE_MODES, VIEW_DEFAULTS, VIEW_TOGGLE_ROWS };
