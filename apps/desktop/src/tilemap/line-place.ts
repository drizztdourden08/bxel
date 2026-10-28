/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { layerOptions } from './layer-options';
import { mapMirrors } from './map-mirrors';
import { readiedMap } from './readied-map';
import { readyStamp } from './ready-stamp';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const linePlace = (from: Point, to: Point): boolean => {
  const target = readiedMap();
  const stamp = target ? readyStamp(target) : null;
  if (!target || !stamp) return false;
  const { flags } = useTilemapStore.getState();
  const key = stamp.keys.find((each) => each !== 0) ?? stamp.keys[0];
  const step = (start: Point, end: Point, each: typeof flags): CommandStep => ({
    name: COMMAND_NAME.mapLine,
    targets: null,
    options: { ...layerOptions(target), from: start, to: end, tile: key, flags: each },
  });
  const mirrored = mapMirrors(target.tilemap).map((mirror) => step(mirror.point(from), mirror.point(to), mirror.flags(flags)));
  return runMap(TILE_LABEL.line, [step(from, to, flags), ...mirrored]);
};

export { linePlace };
