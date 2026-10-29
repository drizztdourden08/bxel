/* @layer core @kind types */
import type { Tile } from '../model/tilemap.type';

type TileLayout = {
  readonly columns: number;
  readonly rows: number;
  readonly slots: readonly (Tile | null)[];
  readonly indexOf: ReadonlyMap<number, number>;
};

export type { TileLayout };
