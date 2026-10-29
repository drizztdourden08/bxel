/* @layer renderer-app @kind types */
import type { CellFlags, MapLayerId, Point, Rect, SpriteId, TilemapId, TilesetId } from '@bxel/document';
import type { CombineMode } from '@bxel/raster';

type TileEditMode = 'place' | 'edit';

type MapSelectVariant = 'rect' | 'wand' | 'same';

interface TileStamp {
  readonly columns: number;
  readonly rows: number;
  readonly keys: readonly number[];
  readonly bits?: readonly number[];
  readonly scatter?: boolean;
}

interface MapSelection {
  readonly rect: Rect;
  readonly from: number;
  readonly mask: Uint8Array | null;
}

interface CellClip {
  readonly stamp: TileStamp;
  readonly origin: Point;
  readonly tilesetId: TilesetId;
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
  selectVariant: MapSelectVariant;
  selectMode: CombineMode;
  clip: CellClip | null;
  paste: CellClip | null;
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
  setSelectVariant: (selectVariant: MapSelectVariant) => void;
  setSelectMode: (selectMode: CombineMode) => void;
  setClip: (clip: CellClip | null) => void;
  setPaste: (paste: CellClip | null) => void;
  setShowCollision: (showCollision: boolean) => void;
  setTerrainBrush: (terrainBrush: boolean) => void;
  setAnimateTiles: (animateTiles: boolean) => void;
}

export type { CellClip, MapSelectVariant, MapSelection, TileEditMode, TileStamp, TilemapSettings, TilemapState };
