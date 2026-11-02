/* @layer renderer-app @kind types */
import type { Artwork, CellFlags, MapLayer, MapLayerId, Point, Tilemap, TilemapId, Tileset, TilesetId } from '@bxel/document';
import type { MapSelection } from '../stores/tilemap-store.type';

type MapTool = 'place' | 'erase' | 'fill' | 'rect' | 'line' | 'scatter' | 'pick' | 'select' | 'hand' | 'zoom';

type FlagOp = 'flipX' | 'flipY' | 'turn';

type StampTransform = 'flipX' | 'flipY' | 'turnRight' | 'turnLeft' | 'reset';

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
  flags?: CellFlags;
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

interface NeighbourSource {
  canvas: HTMLCanvasElement;
  at: Point;
  columns: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
}

export type { CellRead, FlagOp, MapContext, MapPicks, MapTarget, MapTool, NeighbourSource, Placement, PlacementGroup, SelectedMap, StampTransform };
