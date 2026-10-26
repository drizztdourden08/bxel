/* @layer core @kind types */
import type { MapLayerId, TilemapId } from '../model/ids.type';
import type { TileAnimationStart } from '../model/tilemap.type';

type TilePlayback = {
  readonly frames: readonly Uint8Array[];
  readonly ends: readonly number[];
  readonly cycleMs: number;
  readonly start: TileAnimationStart;
};

type TileSeed = {
  readonly map: TilemapId;
  readonly layer: MapLayerId;
  readonly cell: number;
};

type TileFrameOf = (layer: MapLayerId, cell: number, key: number) => Uint8Array | null;

export type { TileFrameOf, TilePlayback, TileSeed };
