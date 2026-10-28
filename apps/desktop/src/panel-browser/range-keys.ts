/* @layer renderer-app @kind logic */
import type { VisibleRow } from './project-browser.type';

const rangeKeys = (rows: readonly VisibleRow[], from: string, to: string): readonly string[] => {
  const first = rows.findIndex((row) => row.item.key === from);
  const last = rows.findIndex((row) => row.item.key === to);
  if (first < 0 || last < 0) return [to];
  const [start, end] = first <= last ? [first, last] : [last, first];
  return rows.slice(start, end + 1).map((row) => row.item.key);
};

export { rangeKeys };
