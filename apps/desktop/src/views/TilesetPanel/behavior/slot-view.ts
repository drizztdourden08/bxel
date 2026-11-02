/* @layer renderer-app @kind logic */
import type { Artwork, Tileset } from '@bxel/document';
import type { GridView } from '../TilesetPanel.type';
import { NONE, NO_ORDER } from './slot-view.constants';

const slotView = (artwork: Artwork, tileset: Tileset): GridView => ({
  artwork,
  tileset,
  mode: 'tiles',
  zoom: 2,
  showKeys: false,
  showUses: false,
  animate: false,
  painted: NONE,
  order: NO_ORDER,
  terrain: null,
});

export { slotView };
