/* @layer core @kind types */
import type { CellFlags } from '../model/cell-flags.type';
import type { MapLayerId, TilemapId } from '../model/ids.type';
import type { Point } from '../model/geometry.type';
import type { Tile } from '../model/tilemap.type';

type MapCellQuery = {
  readonly tilemapId: TilemapId;
  readonly layerId: MapLayerId;
  readonly at: Point;
};

type PickedCell = {
  readonly key: number;
  readonly flags: CellFlags;
  readonly tile: Tile | null;
};

export type { MapCellQuery, PickedCell };
