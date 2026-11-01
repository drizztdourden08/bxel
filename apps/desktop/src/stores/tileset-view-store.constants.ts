/* @layer renderer-app @kind constants */
import type { TilesetViewSettings } from './tileset-view-store.type';

const TILESET_VIEW_DEFAULTS: TilesetViewSettings = {
  mode: 'tiles',
  search: '',
  filters: [],
  choices: [],
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
  hoverKey: null,
};

export { TILESET_VIEW_DEFAULTS };
