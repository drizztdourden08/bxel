/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { Rec } from './rec.type';

type TiledOrientation = 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';

type TiledStaggerAxis = 'x' | 'y';

type TiledStaggerIndex = 'odd' | 'even';

type TiledPoint = { readonly x: number; readonly y: number };

type TiledShape =
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
  | { readonly kind: 'polygon'; readonly points: readonly TiledPoint[] };

type TiledProperties = Readonly<Record<string, string | number | boolean>>;

type TiledImage = {
  readonly source: string;
  readonly width: number;
  readonly height: number;
  readonly transparent: string | null;
};

type TiledTile = {
  readonly id: number;
  readonly image: TiledImage | null;
  readonly shapes: readonly TiledShape[];
  readonly properties: TiledProperties;
};

type TiledTileset = {
  readonly name: string;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly spacing: number;
  readonly margin: number;
  readonly columns: number;
  readonly tileCount: number;
  readonly image: TiledImage | null;
  readonly tiles: readonly TiledTile[];
};

type TiledTilesetRef = {
  readonly firstGid: number;
  readonly source: string | null;
  readonly embedded: TiledTileset | null;
};

type TiledLayer = {
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly opacity: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly gids: Uint32Array;
};

type TiledMap = {
  readonly orientation: TiledOrientation;
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly staggerAxis: TiledStaggerAxis;
  readonly staggerIndex: TiledStaggerIndex;
  readonly hexSideLength: number;
  readonly layers: readonly TiledLayer[];
  readonly tilesets: readonly TiledTilesetRef[];
  readonly skippedLayers: number;
};

type TiledMapResult = { readonly ok: true; readonly map: TiledMap } | FormatFailure;

type TextKind = 'map' | 'tileset';

type TiledText = { readonly ok: true; readonly record: Rec } | FormatFailure;

type TiledTilesetResult = { readonly ok: true; readonly tileset: TiledTileset } | FormatFailure;

export type {
  TextKind,
  TiledImage,
  TiledLayer,
  TiledMap,
  TiledMapResult,
  TiledOrientation,
  TiledPoint,
  TiledProperties,
  TiledShape,
  TiledStaggerAxis,
  TiledStaggerIndex,
  TiledTile,
  TiledText,
  TiledTileset,
  TiledTilesetRef,
  TiledTilesetResult,
};
