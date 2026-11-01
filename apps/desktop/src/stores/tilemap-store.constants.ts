/* @layer renderer-app @kind constants */
import { NO_FLAGS } from '@bxel/document';
import type { TileStamp, TilemapSettings } from './tilemap-store.type';

const STAMP_SLOTS = 9;

const EMPTY_STAMP: TileStamp = { columns: 1, rows: 1, keys: [0] };

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const calmByDefault = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

const TILEMAP_DEFAULTS: TilemapSettings = {
  tilesetId: null,
  mapId: null,
  layerId: null,
  editMode: 'place',
  editKey: null,
  editSpriteId: null,
  stamp: EMPTY_STAMP,
  stampSlots: Array.from({ length: STAMP_SLOTS }, () => null),
  flags: NO_FLAGS,
  filled: true,
  selection: null,
  selectVariant: 'rect',
  selectMode: 'replace',
  clip: null,
  paste: null,
  showCollision: false,
  terrainBrush: false,
  animateTiles: !calmByDefault(),
};

export { STAMP_SLOTS, TILEMAP_DEFAULTS };
