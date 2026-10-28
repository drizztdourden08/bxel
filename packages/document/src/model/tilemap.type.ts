/* @layer core @kind types */
import type { Point } from './geometry.type';
import type { AnimationId, BankId, MapLayerId, SpriteId, TagId, TileId, TilemapId, TilesetId } from './ids.type';
import type { Guides } from './sprite.type';

type TileCollision =
  | { readonly kind: 'full' }
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
  | { readonly kind: 'polygon'; readonly points: readonly Point[] };

type TileShape = TileCollision & { readonly layer: string; readonly oneWay?: boolean };

type TileTurns = 'none' | 'flips' | 'all';

type FieldValue = string | number | boolean;

type TileFieldKind = 'bool' | 'int' | 'number' | 'text' | 'choice' | 'colour';

type TileField = {
  readonly name: string;
  readonly kind: TileFieldKind;
  readonly default: FieldValue;
  readonly choices?: readonly string[];
};

type TileData = Readonly<Record<string, FieldValue>>;

type TerrainKind = 'blob16' | 'blob47';

type TerrainRules = { readonly kind: TerrainKind; readonly keys: readonly number[] };

type MapOrientation = {
  readonly kind: 'isometric' | 'staggered' | 'hexagonal';
  readonly staggerAxis: 'x' | 'y';
  readonly staggerIndex: 'odd' | 'even';
  readonly hexSideLength: number;
};

type TileAnimationStart = 'together' | 'random';

type TileAnimation = {
  readonly animationId: AnimationId;
  readonly tagId: TagId | null;
  readonly start: TileAnimationStart;
};

type Tile = {
  readonly id: TileId;
  readonly key: number;
  readonly spriteId: SpriteId;
  readonly shapes?: readonly TileShape[];
  readonly animation?: TileAnimation;
  readonly layout?: number;
  readonly type?: string;
  readonly probability?: number;
  readonly turns?: TileTurns;
  readonly data?: TileData;
};

type Tileset = {
  readonly id: TilesetId;
  readonly name: string;
  readonly created?: number;
  readonly bankId: BankId;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly nextKey: number;
  readonly tiles: readonly Tile[];
  readonly terrain?: TerrainRules;
  readonly columns?: number;
  readonly fields?: readonly TileField[];
  readonly collisionLayers?: readonly string[];
};

type MapLayer = {
  readonly id: MapLayerId;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly colour?: string;
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
  readonly orientation?: MapOrientation;
  readonly guides?: Guides;
};

export type {
  FieldValue,
  MapLayer,
  MapOrientation,
  TerrainKind,
  TerrainRules,
  Tile,
  TileAnimation,
  TileAnimationStart,
  TileCollision,
  TileData,
  TileField,
  TileFieldKind,
  TileShape,
  TileTurns,
  Tilemap,
  Tileset,
};
