/* @layer core @kind logic */
import { GIF_BLOCK } from './gif-block.constants';

const colorTableLength = (packed: number): number =>
  (packed & GIF_BLOCK.TABLE_FLAG) === 0 ? 0 : 3 * (1 << ((packed & 7) + 1));

export { colorTableLength };
