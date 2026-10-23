/* @layer core @kind logic */
import { PNG_FILTER_SCORE } from './png-filter-score.constants';

const scoreRow = (bytes: Uint8Array): number => {
  let sum = 0;
  for (const byte of bytes) {
    sum += byte < PNG_FILTER_SCORE.SIGNED_MIDPOINT ? byte : PNG_FILTER_SCORE.BYTE_RANGE - byte;
  }
  return sum;
};

export { scoreRow };
