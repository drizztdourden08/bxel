/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { RgbaImage } from '../png.type';
import type {
  TiledMap,
  TiledOrientation,
  TiledProperties,
  TiledShape,
  TiledStaggerAxis,
  TiledStaggerIndex,
  TiledTileset,
} from './tiled.type';

type ResolvedTileset = {
  readonly firstGid: number;
  readonly tileset: TiledTileset;
  readonly image: RgbaImage | null;
  readonly tileImages: ReadonlyMap<number, RgbaImage>;
};

type TiledSources = {
  readonly map: TiledMap;
  readonly tilesets: readonly ResolvedTileset[];
};

type PlannedTile = {
  readonly gid: number;
  readonly image: RgbaImage;
  readonly shapes: readonly TiledShape[];
  readonly properties: TiledProperties;
};

type PlannedLayer = {
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly cells: Uint32Array;
};

type TiledPlan = {
  readonly ok: true;
  readonly columns: number;
  readonly rows: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly orientation: TiledOrientation;
  readonly staggerAxis: TiledStaggerAxis;
  readonly staggerIndex: TiledStaggerIndex;
  readonly hexSideLength: number;
  readonly tileset: string;
  readonly tiles: readonly PlannedTile[];
  readonly layers: readonly PlannedLayer[];
  readonly warnings: readonly string[];
};

type TiledPlanResult = TiledPlan | FormatFailure;

type LayerCounts = { missing: number; rotated: number };

export type { LayerCounts, PlannedLayer, PlannedTile, ResolvedTileset, TiledPlan, TiledPlanResult, TiledSources };
