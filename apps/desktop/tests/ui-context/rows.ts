/* @layer renderer-app @kind test */
import { COLUMN_NAMES } from './columns';
import type { Column } from './columns';

type Cell = 'shown' | 'disabled' | 'hidden';

type Row = Readonly<Record<Column, Cell>>;

const cellOf = (column: Column, shown: readonly Column[], disabled: readonly Column[]): Cell => {
  if (shown.includes(column)) return 'shown';
  return disabled.includes(column) ? 'disabled' : 'hidden';
};

const rowOf = (shown: readonly Column[], disabled: readonly Column[] = []): Row =>
  Object.fromEntries(COLUMN_NAMES.map((column) => [column, cellOf(column, shown, disabled)])) as Row;

export { rowOf };
export type { Cell, Row };
