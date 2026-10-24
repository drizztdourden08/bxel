/* @layer core @kind logic */
import { CELL } from './cell.constants';
import { FLAG_BIT } from './flag-bits.constants';

const flagBitsOf = (cell: number): number =>
  ((cell & CELL.FLIP_X) === 0 ? 0 : FLAG_BIT.flipX) | ((cell & CELL.FLIP_Y) === 0 ? 0 : FLAG_BIT.flipY) | ((cell & CELL.DIAGONAL) === 0 ? 0 : FLAG_BIT.diagonal);

export { flagBitsOf };
