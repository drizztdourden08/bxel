/* @layer renderer-app @kind constants */
import type { TilesetViewSettings } from './tileset-view-store.type';

const TILESET_VIEW_DEFAULTS: TilesetViewSettings = {
  mode: 'tiles',
  search: '',
  filters: [],
  zoom: 'fit',
  showKeys: true,
  showUses: false,
  collisionPaint: 'select',
  collisionLayer: 'solid',
  dataPaint: null,
  inspectorCollapsed: false,
  shapeIndex: 0,
  lastShape: null,
  shapeClipboard: [],
  terrainSetId: null,
  terrainSlot: null,
  markDrafts: {},
};

export { TILESET_VIEW_DEFAULTS };
