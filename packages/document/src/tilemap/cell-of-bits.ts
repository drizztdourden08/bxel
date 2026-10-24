/* @layer core @kind logic */
import { FLAG_BIT } from './flag-bits.constants';
import { makeCell } from './make-cell';

const cellOfBits = (key: number, bits: number): number =>
  makeCell(key, { flipX: (bits & FLAG_BIT.flipX) !== 0, flipY: (bits & FLAG_BIT.flipY) !== 0, diagonal: (bits & FLAG_BIT.diagonal) !== 0 });

export { cellOfBits };
