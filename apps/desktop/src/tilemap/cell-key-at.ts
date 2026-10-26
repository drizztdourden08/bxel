/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { currentMap } from './current-map';
import { readCell } from './read-cell';

const cellKeyAt = (at: Point): number | null => {
  const target = currentMap();
  const read = target ? readCell(target.tilemap, target.layer, at) : null;
  return read === null || read.key === 0 ? null : read.key;
};

export { cellKeyAt };
