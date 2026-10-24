/* @layer core @kind types */
import type { MapLayerId, TilemapId } from '../model/ids.type';

type BrokenCell = {
  readonly tilemapId: TilemapId;
  readonly layerId: MapLayerId;
  readonly x: number;
  readonly y: number;
  readonly key: number;
};

export type { BrokenCell };
