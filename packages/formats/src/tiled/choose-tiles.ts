/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { TILED_FLAG, TILED_LIMITS } from './tiled.constants';
import type { PlannedTile, TiledSources } from './tiled-plan.type';

const usedGids = (sources: TiledSources): Set<number> => {
  const used = new Set<number>();
  for (const layer of sources.map.layers) {
    for (const gid of layer.gids) {
      const bare = gid & TILED_FLAG.KEY_MASK;
      if (bare !== 0) used.add(bare);
    }
  }
  return used;
};

const chooseTiles = (all: readonly PlannedTile[], sources: TiledSources): PlannedTile[] | FormatFailure => {
  const ordered = [...all].sort((a, b) => a.gid - b.gid);
  if (ordered.length <= TILED_LIMITS.MAX_PLAN_TILES) return ordered;
  const used = usedGids(sources);
  const kept = ordered.filter((tile) => used.has(tile.gid));
  return kept.length <= TILED_LIMITS.MAX_PLAN_TILES
    ? kept
    : formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, `The map uses ${kept.length} tiles. A Bxel tileset holds at most ${TILED_LIMITS.MAX_PLAN_TILES}.`);
};

export { chooseTiles };
