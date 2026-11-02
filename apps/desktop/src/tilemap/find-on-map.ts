/* @layer renderer-app @kind logic */
import { selectCells } from './select-cells';
import { targetKeys } from './target-keys';
import { tileOf } from './tile-of';

const findOnMap = (key?: number): boolean => {
  const tile = tileOf(key);
  if (tile === null) return false;
  return targetKeys(tile).every((each, at) => selectCells({ by: 'tile', key: each }, at === 0 ? 'replace' : 'add'));
};

export { findOnMap };
