/* @layer core @kind logic */
import type { TransactionOk } from '../commands/result.type';

const okResult = (
  fields: Pick<TransactionOk, 'mode' | 'baseRevision' | 'revision' | 'changes'> & Partial<TransactionOk>,
): TransactionOk => ({
  ok: true,
  noop: false,
  created: {},
  report: {},
  warnings: [],
  preview: null,
  ...fields,
});

export { okResult };
