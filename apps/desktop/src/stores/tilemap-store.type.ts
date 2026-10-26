/* @layer renderer-app @kind types */
import type { CellFlags, MapLayerId, Rect, SpriteId, TilemapId, TilesetId } from '@bxel/document';

type TileEditMode = 'place' | 'edit';

interface TileStamp {
  readonly columns: number;
  readonly rows: number;
  readonly keys: readonly number[];
}

interface MapSelection {
  readonly rect: Rect;
  readonly from: number;
}

interface TilemapSettings {
  tilesetId: TilesetId | null;
  mapId: TilemapId | null;
  layerId: MapLayerId | null;
  editMode: TileEditMode;
  editKey: number | null;
  editSpriteId: SpriteId | null;
  stamp: TileStamp;
  flags: CellFlags;
  filled: boolean;
  selection: MapSelection | null;
  showCollision: boolean;
  terrainBrush: boolean;
  animateTiles: boolean;
}

interface TilemapState extends TilemapSettings {
  reset: () => void;
  setTileset: (tilesetId: TilesetId | null) => void;
  setMap: (mapId: TilemapId | null) => void;
  setLayer: (layerId: MapLayerId | null) => void;
  placeTiles: () => void;
  editTile: (key: number, spriteId: SpriteId) => void;
  setStamp: (stamp: TileStamp) => void;
  setFlags: (flags: CellFlags) => void;
  setFilled: (filled: boolean) => void;
  setSelection: (selection: MapSelection | null) => void;
  setShowCollision: (showCollision: boolean) => void;
  setTerrainBrush: (terrainBrush: boolean) => void;
  setAnimateTiles: (animateTiles: boolean) => void;
}

export type { MapSelection, TileEditMode, TileStamp, TilemapSettings, TilemapState };
