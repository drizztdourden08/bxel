/* @layer tests @kind helper */
import { exportTilesetImage } from '@bxel/formats';
import type { TilemapExportInput, TilemapJsonResult, TilesetImage, TilesetTile } from '@bxel/formats';

const solid = (red: number, green: number, size = 2): TilesetTile['image'] => {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i += 1) data.set([red, green, i, 255], i * 4);
  return { data, width: size, height: size };
};

const makeTiles = (keys: readonly number[], size = 2): TilesetTile[] =>
  keys.map((key) => ({ key, image: solid(key * 10, key * 5, size) }));

const mustImage = (...args: Parameters<typeof exportTilesetImage>): TilesetImage => {
  const result = exportTilesetImage(...args);
  if (!result.ok) throw new Error(result.message);
  return result;
};

const makeMapInput = (cells: readonly number[], keys: readonly number[] = [5, 9, 12]): TilemapExportInput => {
  const image = mustImage({ tileWidth: 2, tileHeight: 2, columns: 2, spacing: 0, margin: 0, tiles: makeTiles(keys) });
  return {
    name: 'level',
    columns: 2,
    rows: 2,
    tileWidth: 2,
    tileHeight: 2,
    tileset: {
      name: 'ground',
      image: 'ground.png',
      imageWidth: image.image.width,
      imageHeight: image.image.height,
      columns: image.columns,
      spacing: 0,
      margin: 0,
      tiles: image.tiles,
    },
    layers: [
      { name: 'Ground', visible: true, locked: false, cells: Uint32Array.from(cells) },
      { name: 'Top', visible: false, locked: true, cells: new Uint32Array(4) },
    ],
  };
};

type ParsedMap = {
  readonly format: string;
  readonly version: number;
  readonly name: string;
  readonly size: { readonly columns: number; readonly rows: number };
  readonly tileSize: { readonly w: number; readonly h: number };
  readonly flagBits: Readonly<Record<string, number>>;
  readonly tileset: {
    readonly name: string;
    readonly image: string;
    readonly size: { readonly w: number; readonly h: number };
    readonly columns: number;
    readonly tiles: readonly { readonly key: number; readonly x: number; readonly y: number }[];
  };
  readonly layers: readonly {
    readonly name: string;
    readonly visible: boolean;
    readonly locked: boolean;
    readonly keys: readonly number[];
    readonly flags: readonly number[];
  }[];
};

type ParsedTiled = {
  readonly type: string;
  readonly orientation: string;
  readonly renderorder: string;
  readonly infinite: boolean;
  readonly width: number;
  readonly height: number;
  readonly tilewidth: number;
  readonly tileheight: number;
  readonly nextlayerid: number;
  readonly tilesets: readonly Readonly<Record<string, unknown>>[];
  readonly layers: readonly {
    readonly id: number;
    readonly name: string;
    readonly type: string;
    readonly visible: boolean;
    readonly locked: boolean;
    readonly opacity: number;
    readonly width: number;
    readonly height: number;
    readonly data: readonly number[];
  }[];
};

const jsonText = (result: TilemapJsonResult): string => {
  if (!result.ok) throw new Error(result.message);
  return result.json;
};

const parseMap = (result: TilemapJsonResult): ParsedMap => JSON.parse(jsonText(result)) as ParsedMap;

const parseTiled = (result: TilemapJsonResult): ParsedTiled => JSON.parse(jsonText(result)) as ParsedTiled;

export { jsonText, makeMapInput, makeTiles, mustImage, parseMap, parseTiled };
