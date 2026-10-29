/* @layer renderer-app @kind types */
import type { FieldValue, TileCollision, TileShape } from '@bxel/document';

type TilesetMode = 'tiles' | 'terrain' | 'collision' | 'data' | 'animation';

type TileFilter = 'used' | 'unused' | 'animated' | 'collision' | 'terrain';

type ThumbZoom = 'fit' | 1 | 2 | 3 | 4;

type CollisionPaint = 'select' | 'full' | 'last';

interface DataPaint {
  readonly field: string;
  readonly value: FieldValue;
}

interface TilesetViewSettings {
  mode: TilesetMode;
  search: string;
  filters: readonly TileFilter[];
  zoom: ThumbZoom;
  showKeys: boolean;
  showUses: boolean;
  collisionPaint: CollisionPaint;
  collisionLayer: string;
  dataPaint: DataPaint | null;
  inspectorCollapsed: boolean;
  shapeIndex: number;
  lastShape: TileCollision | null;
  shapeClipboard: readonly TileShape[];
  terrainSetId: string | null;
  terrainSlot: number | null;
  markDrafts: Readonly<Record<number, number>>;
}

interface TilesetViewState extends TilesetViewSettings {
  setMode: (mode: TilesetMode) => void;
  setSearch: (search: string) => void;
  toggleFilter: (filter: TileFilter) => void;
  clearFilters: () => void;
  setZoom: (zoom: ThumbZoom) => void;
  setShowKeys: (show: boolean) => void;
  setShowUses: (show: boolean) => void;
  setCollisionPaint: (paint: CollisionPaint) => void;
  setCollisionLayer: (layer: string) => void;
  setDataPaint: (paint: DataPaint | null) => void;
  setInspectorCollapsed: (collapsed: boolean) => void;
  setShapeIndex: (index: number) => void;
  setLastShape: (shape: TileCollision | null) => void;
  setShapeClipboard: (shapes: readonly TileShape[]) => void;
  setTerrainSetId: (id: string | null) => void;
  setTerrainSlot: (slot: number | null) => void;
  setMarkDraft: (key: number, mask: number | null) => void;
}

export type { ThumbZoom, TileFilter, TilesetMode, TilesetViewSettings, TilesetViewState };
