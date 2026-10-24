/* @layer core @kind logic */
import type { CellFlags } from '../../model/cell-flags.type';
import type { Tileset } from '../../model/tilemap.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const checkFlags = (tileset: Tileset, flags: CellFlags): void => {
  if (flags.diagonal && tileset.tileWidth !== tileset.tileHeight) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A diagonal flip needs square tiles.', { path: 'options.flags.diagonal' });
  }
};

export { checkFlags };
