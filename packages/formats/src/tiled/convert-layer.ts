/* @layer core @kind logic */
import { KEPT_FLAGS, TILED_FLAG } from './tiled.constants';
import type { TiledLayer } from './tiled.type';
import type { LayerCounts, PlannedLayer } from './tiled-plan.type';

const convertLayer = (layer: TiledLayer, keyOf: ReadonlyMap<number, number>, counts: LayerCounts): PlannedLayer => {
  const cells = new Uint32Array(layer.gids.length);
  layer.gids.forEach((gid, at) => {
    const bare = gid & TILED_FLAG.KEY_MASK;
    if (bare === 0) return;
    if ((gid & TILED_FLAG.HEX_ROTATE) !== 0) counts.rotated += 1;
    const key = keyOf.get(bare);
    if (key === undefined) counts.missing += 1;
    else cells[at] = (key | (gid & KEPT_FLAGS)) >>> 0;
  });
  return { name: layer.name, visible: layer.visible, locked: layer.locked, cells };
};

export { convertLayer };
