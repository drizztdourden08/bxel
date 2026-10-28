/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { layerOptions } from './layer-options';
import { mapMirrors } from './map-mirrors';
import { placeStampAt } from './place-stamp-at';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { terrainActive } from './terrain/terrain-active';
import { terrainCells } from './terrain/terrain-cells';
import { TILE_LABEL } from './tilemap.constants';

const strokePlace = (points: readonly Point[]): boolean => {
  const target = readiedMap();
  if (target && terrainActive(target)) return terrainCells(target, points, false);
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  if (stamp.keys.length > 1) return placeStampAt(points);
  const { flags } = useTilemapStore.getState();
  const step = (cells: readonly Point[], each: typeof flags): CommandStep => ({
    name: COMMAND_NAME.mapPaint,
    targets: null,
    options: { ...layerOptions(target), points: cells, tile: stamp.keys[0], flags: each },
  });
  const mirrored = mapMirrors(target.tilemap).map((mirror) => step(points.map(mirror.point), mirror.flags(flags)));
  return runMap(TILE_LABEL.place, [step(points, flags), ...mirrored]);
};

export { strokePlace };
