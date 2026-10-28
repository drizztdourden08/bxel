/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point } from '@bxel/document';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { layerOptions } from './layer-options';
import { mapMirrors } from './map-mirrors';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const scatterPlace = (cells: readonly Point[]): boolean => {
  const target = readiedMap();
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  const tiles = stamp.keys.filter((each) => each !== 0);
  if (tiles.length === 0) return false;
  const { flags } = useTilemapStore.getState();
  const seed = useDrawingStore.getState().spraySeed ?? Math.floor(Math.random() * 4294967296);
  const step = (at: readonly Point[], each: typeof flags): CommandStep => ({
    name: COMMAND_NAME.mapPaint,
    targets: null,
    options: { ...layerOptions(target), cells: at, random: { tiles, seed }, flags: each },
  });
  const mirrored = mapMirrors(target.tilemap).map((mirror) => step(cells.map(mirror.point), mirror.flags(flags)));
  return runMap(TILE_LABEL.scatter, [step(cells, flags), ...mirrored]);
};

export { scatterPlace };
