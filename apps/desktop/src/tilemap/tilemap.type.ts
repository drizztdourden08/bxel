/* @layer renderer-app @kind types */
import type { Artwork, CellFlags, MapLayer, MapLayerId, Point, Tilemap, TilemapId, Tileset, TilesetId } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';

type MapTool = 'place' | 'erase' | 'fill' | 'rect' | 'pick' | 'select' | 'hand' | 'zoom';

type FlagOp = 'flipX' | 'flipY' | 'turn';

interface MapPicks {
  tilesetId: TilesetId | null;
  mapId: TilemapId | null;
  layerId: MapLayerId | null;
}

interface MapContext {
  artwork: Artwork;
  tileset: Tileset | null;
  tilemap: Tilemap | null;
  layer: MapLayer | null;
}

interface MapTarget {
  artwork: Artwork;
  tileset: Tileset;
  tilemap: Tilemap;
  layer: MapLayer;
}

interface SelectedMap {
  target: MapTarget;
  selection: MapSelection;
}

interface Placement {
  key: number;
  cell: Point;
}

interface PlacementGroup {
  key: number;
  flags: CellFlags;
  cells: Point[];
}

interface CellRead {
  key: number;
  flags: CellFlags;
}

export type { CellRead, FlagOp, MapContext, MapPicks, MapTarget, MapTool, Placement, PlacementGroup, SelectedMap };
