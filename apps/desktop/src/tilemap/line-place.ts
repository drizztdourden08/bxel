/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point } from '@bxel/document';
import { layerOptions } from './layer-options';
import { mapMirrors } from './map-mirrors';
import { placedMap } from './placed-map';
import { runMap } from './run-map';
import { TILE_LABEL } from './tilemap.constants';

const linePlace = (from: Point, to: Point): boolean => {
  const placed = placedMap();
  if (!placed) return false;
  const { target, stamp, flags } = placed;
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
