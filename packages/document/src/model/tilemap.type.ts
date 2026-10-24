/* @layer core @kind types */
import type { Point } from './geometry.type';
import type { BankId, MapLayerId, SpriteId, TileId, TilemapId, TilesetId } from './ids.type';

type TileCollision =
  | { readonly kind: 'full' }
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
  | { readonly kind: 'polygon'; readonly points: readonly Point[] };

type TerrainKind = 'blob16' | 'blob47';

type TerrainRules = { readonly kind: TerrainKind; readonly keys: readonly number[] };

type Tile = {
  readonly id: TileId;
  readonly key: number;
  readonly spriteId: SpriteId;
  readonly collision?: TileCollision;
};

type Tileset = {
  readonly id: TilesetId;
  readonly name: string;
  readonly bankId: BankId;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly nextKey: number;
  readonly tiles: readonly Tile[];
  readonly terrain?: TerrainRules;
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
  readonly tilesetId: TilesetId;
  readonly columns: number;
  readonly rows: number;
  readonly layers: readonly MapLayer[];
};

export type { MapLayer, TerrainKind, TerrainRules, Tile, TileCollision, Tilemap, Tileset };
