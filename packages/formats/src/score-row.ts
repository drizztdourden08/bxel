/* @layer core @kind logic */
import { PNG_FILTER_COST } from './png-filter-score.constants';

const scoreRow = (bytes: Uint8Array): number => {
  const cost = PNG_FILTER_COST;
  let sum = 0;
  const count = bytes.length;
  for (let i = 0; i < count; i += 1) {
    sum += cost[bytes[i] ?? 0] ?? 0;
  }
  return sum;
};

export { scoreRow };
