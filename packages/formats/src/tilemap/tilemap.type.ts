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

type TileShapeEntry = TileShape & { readonly layer: string; readonly oneWay?: boolean };

type TileFieldValue = string | number | boolean;

type TilesetEntry = TilesetPlacement & {
  readonly collision?: TileShape;
  readonly shapes?: readonly TileShapeEntry[];
  readonly type?: string;
  readonly probability?: number;
  readonly turns?: 'none' | 'flips' | 'all';
  readonly data?: Readonly<Record<string, TileFieldValue>>;
};

type TileAnimationFrame = {
  readonly key: number;
  readonly durationMs: number;
};

type TileAnimationEntry = {
  readonly key: number;
  readonly start: 'together' | 'random';
  readonly frames: readonly TileAnimationFrame[];
};

type TileFieldEntry = {
  readonly name: string;
  readonly kind: 'bool' | 'int' | 'number' | 'text' | 'choice' | 'colour';
  readonly default: TileFieldValue;
  readonly choices?: readonly string[];
};

type TerrainVariantEntry = {
  readonly key: number;
  readonly weight: number;
  readonly flipX?: boolean;
  readonly flipY?: boolean;
  readonly diagonal?: boolean;
};

type TerrainSetEntry = {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly slots: readonly (readonly TerrainVariantEntry[])[];
};

type TilesetDescriptor = {
  readonly name: string;
  readonly image: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly columns: number;
  readonly spacing: number;
  readonly margin: number;
  readonly tiles: readonly TilesetEntry[];
  readonly fields?: readonly TileFieldEntry[];
  readonly terrain?: { readonly kind: string; readonly keys: readonly number[] };
  readonly terrainSets?: readonly TerrainSetEntry[];
  readonly animations?: readonly TileAnimationEntry[];
};

type TilemapLayerInput = {
  readonly id?: string;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly opacity?: number;
  readonly group?: boolean;
  readonly parentId?: string;
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
  TileAnimationEntry,
  TileAnimationFrame,
  TileShape,
  TileSize,
  TilesetDescriptor,
  TerrainSetEntry,
  TerrainVariantEntry,
  TileFieldEntry,
  TileFieldValue,
  TileShapeEntry,
  TilesetEntry,
  TilesetImage,
  TilesetImageInput,
  TilesetImageResult,
  TilesetPlacement,
  TilesetTile,
};
