/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { RgbaImage } from '../png.type';

type TilesetTile = {
  readonly key: number;
  readonly image: RgbaImage;
};

type TileShape =
  | { readonly kind: 'full' }
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
  | { readonly kind: 'polygon'; readonly points: readonly { readonly x: number; readonly y: number }[] };

type TileSize = { readonly width: number; readonly height: number };

type TilesetImageInput = {
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly columns: number;
  readonly spacing: number;
  readonly margin: number;
  readonly tiles: readonly TilesetTile[];
};

type TilesetPlacement = {
  readonly key: number;
  readonly x: number;
  readonly y: number;
};

type TilesetImage = {
  readonly ok: true;
  readonly image: RgbaImage;
  readonly png: Uint8Array;
  readonly columns: number;
  readonly rows: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly spacing: number;
  readonly margin: number;
  readonly tiles: readonly TilesetPlacement[];
};

type TilesetImageResult = TilesetImage | FormatFailure;

type TilesetEntry = TilesetPlacement & { readonly collision?: TileShape };

type TilesetDescriptor = {
  readonly name: string;
  readonly image: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly columns: number;
  readonly spacing: number;
  readonly margin: number;
  readonly tiles: readonly TilesetEntry[];
  readonly terrain?: { readonly kind: string; readonly keys: readonly number[] };
};

type TilemapLayerInput = {
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly cells: Uint32Array;
};

type MapOrientationInput = {
  readonly kind: 'isometric' | 'staggered' | 'hexagonal';
  readonly staggerAxis: 'x' | 'y';
  readonly staggerIndex: 'odd' | 'even';
  readonly hexSideLength: number;
};

type TilemapExportInput = {
  readonly name: string;
  readonly columns: number;
  readonly rows: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly tileset: TilesetDescriptor;
  readonly layers: readonly TilemapLayerInput[];
  readonly orientation?: MapOrientationInput | undefined;
};

type TilemapJsonResult = { readonly ok: true; readonly json: string } | FormatFailure;

export type {
  MapOrientationInput,
  TilemapExportInput,
  TilemapJsonResult,
  TilemapLayerInput,
  TileShape,
  TileSize,
  TilesetDescriptor,
  TilesetEntry,
  TilesetImage,
  TilesetImageInput,
  TilesetImageResult,
  TilesetPlacement,
  TilesetTile,
};
