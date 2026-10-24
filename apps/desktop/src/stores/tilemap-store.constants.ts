/* @layer renderer-app @kind constants */
import { NO_FLAGS } from '@bxel/document';
import type { TileStamp, TilemapSettings } from './tilemap-store.type';

const EMPTY_STAMP: TileStamp = { columns: 1, rows: 1, keys: [0] };

const TILEMAP_DEFAULTS: TilemapSettings = {
  tilesetId: null,
  mapId: null,
  layerId: null,
  editMode: 'place',
  editKey: null,
  editSpriteId: null,
  stamp: EMPTY_STAMP,
  flags: NO_FLAGS,
  filled: true,
  selection: null,
};

export { TILEMAP_DEFAULTS };
