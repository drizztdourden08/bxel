/* @layer renderer-app @kind logic */
import type { SelectionState, VisibleRow } from '../../../../../panel-browser/project-browser.type';

const tabbableKey = (rows: readonly VisibleRow[], selection: SelectionState): string | undefined => {
  const has = (key: string | null): key is string => key !== null && rows.some((row) => row.item.key === key);
  if (has(selection.focus)) return selection.focus;
  return rows.find((row) => selection.keys.has(row.item.key))?.item.key ?? rows[0]?.item.key;
};

export { tabbableKey };
