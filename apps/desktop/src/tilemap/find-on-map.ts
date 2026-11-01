/* @layer renderer-app @kind logic */
import { selectCells } from './select-cells';
import { tileOf } from './tile-of';

const findOnMap = (key?: number): boolean => {
  const tile = tileOf(key);
  return tile === null ? false : selectCells({ by: 'tile', key: tile.key }, 'replace');
};

export { findOnMap };
