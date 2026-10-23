/* @layer core @kind logic */
import { identityTable } from './identity-table';
import { isPermutation } from './is-permutation';
import type { ReorderTables } from './remap.type';

const buildReorderTables = (order: readonly number[]): ReorderTables => {
  if (!isPermutation(order)) throw new Error('INVALID_PERMUTATION: order is not a permutation');
  const forward = identityTable();
  const inverse = identityTable();
  for (const [next, previous] of order.entries()) {
    forward[previous] = next;
    inverse[next] = previous;
  }
  return { forward, inverse };
};

export { buildReorderTables };
