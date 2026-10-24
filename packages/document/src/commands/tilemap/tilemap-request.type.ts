/* @layer core @kind types */
import type { TilesetId } from '../../model/ids.type';
import type { EntityRef } from '../../schema/entity-ref.type';

type TilemapRequest = {
  readonly name: string;
  readonly tileset: EntityRef<TilesetId>;
  readonly columns: number;
  readonly rows: number;
};

export type { TilemapRequest };
