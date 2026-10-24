/* @layer core @kind types */
import type { BankId, MapLayerId, SpriteId, TileId, TilemapId, TilesetId } from './ids.type';

type Tile = { readonly id: TileId; readonly key: number; readonly spriteId: SpriteId };

type Tileset = {
  readonly id: TilesetId;
  readonly name: string;
  readonly created?: number;
  readonly bankId: BankId;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly nextKey: number;
  readonly tiles: readonly Tile[];
};

type MapLayer = {
  readonly id: MapLayerId;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly cells: Uint32Array;
};

type Tilemap = {
  readonly id: TilemapId;
  readonly name: string;
  readonly created?: number;
  readonly tilesetId: TilesetId;
  readonly columns: number;
  readonly rows: number;
  readonly layers: readonly MapLayer[];
};

export type { MapLayer, Tile, Tilemap, Tileset };
