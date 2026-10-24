/* @layer core @kind logic */
import { cellKey } from '../../tilemap/cell-key';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const placedKey = (cells: Uint32Array, indexes: readonly number[]): number => {
  const keys = new Set(indexes.map((index) => cellKey(cells[index] ?? 0)));
  const [key] = keys;
  if (keys.size !== 1 || key === undefined || key === 0) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'The cells must all hold the same placed tile.', { path: 'options.cells' });
  }
  return key;
};

export { placedKey };
