/* @layer renderer-app @kind logic */
import type { VisibleRow } from './project-browser.type';

const typeAhead = (rows: readonly VisibleRow[], from: string | null, typed: string): string | null => {
  const needle = typed.toLowerCase();
  const start = Math.max(0, rows.findIndex((row) => row.item.key === from));
  const order = [...rows.slice(start + (needle.length === 1 ? 1 : 0)), ...rows.slice(0, start + 1)];
  return order.find((row) => row.item.name.toLowerCase().startsWith(needle))?.item.key ?? null;
};

export { typeAhead };
