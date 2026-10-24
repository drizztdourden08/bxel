/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { chooseTiles } from './choose-tiles';
import { convertLayer } from './convert-layer';
import { planWarnings } from './plan-warnings';
import type { LayerCounts, TiledPlanResult, TiledSources } from './tiled-plan.type';
import { tilesetTiles } from './tileset-tiles';

const mismatch = (sources: TiledSources): FormatFailure | null => {
  const { map } = sources;
  if (sources.tilesets.length === 0) return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The map uses no tileset.');
  const wrong = sources.tilesets.find(
    ({ tileset }) => tileset.tileWidth !== map.tileWidth || tileset.tileHeight !== map.tileHeight,
  );
  if (!wrong) return null;
  const { tileset } = wrong;
  return formatFail(
    FORMAT_ERROR_CODE.TILED_UNSUPPORTED,
    `The tileset ${tileset.name} has ${tileset.tileWidth} x ${tileset.tileHeight} tiles, but the map cells are ${map.tileWidth} x ${map.tileHeight}. Bxel needs both to match.`,
  );
};

const planTiledImport = (sources: TiledSources): TiledPlanResult => {
  const problem = mismatch(sources);
  if (problem) return problem;
  const { map } = sources;
  const chosen = chooseTiles(sources.tilesets.flatMap(tilesetTiles), sources);
  if (!Array.isArray(chosen)) return chosen;
  const tiles = chosen;
  if (tiles.length === 0) return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The tilesets hold no tiles.');
  if (map.layers.length === 0) return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The map has no tile layers.');
  const keyOf = new Map(tiles.map((tile, at) => [tile.gid, at + 1] as const));
  const counts: LayerCounts = { missing: 0, rotated: 0 };
  const layers = map.layers.map((layer) => convertLayer(layer, keyOf, counts));
  return {
    ok: true,
    columns: map.width,
    rows: map.height,
    tileWidth: map.tileWidth,
    tileHeight: map.tileHeight,
    orientation: map.orientation,
    staggerAxis: map.staggerAxis,
    staggerIndex: map.staggerIndex,
    hexSideLength: map.hexSideLength,
    tileset: sources.tilesets[0]?.tileset.name ?? 'tiles',
    tiles,
    layers,
    warnings: planWarnings(map, tiles, counts),
  };
};

export { planTiledImport };
