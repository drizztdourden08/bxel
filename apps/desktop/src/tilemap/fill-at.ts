/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { inBounds } from './in-bounds';
import { layerOptions } from './layer-options';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const fillAt = (at: Point): boolean => {
  const target = readiedMap();
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp || !inBounds(target.tilemap, at)) return false;
  const tile = stamp.keys.find((key) => key !== 0);
  const options = { ...layerOptions(target), at, tile, flags: useTilemapStore.getState().flags };
  return runMap(TILE_LABEL.fill, [{ name: COMMAND_NAME.mapFill, targets: null, options }]);
};

export { fillAt };
