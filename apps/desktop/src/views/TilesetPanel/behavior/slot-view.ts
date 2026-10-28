/* @layer renderer-app @kind logic */
import type { Artwork, Tileset } from '@bxel/document';
import type { GridView } from '../TilesetPanel.type';

const NONE: ReadonlySet<number> = new Set();

const NO_ORDER: ReadonlyMap<number, number> = new Map();

const slotView = (artwork: Artwork, tileset: Tileset): GridView => ({
  artwork,
  tileset,
  mode: 'tiles',
  zoom: 2,
  showKeys: false,
  showUses: false,
  animate: false,
  painted: NONE,
  focused: -1,
  order: NO_ORDER,
});

export { slotView };
