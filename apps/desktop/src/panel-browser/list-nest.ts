/* @layer renderer-app @kind logic */
import type { BrowserItem, VisibleRow } from './project-browser.type';
import type { ViewTree } from './browser-state.type';

const listNest = (rows: readonly VisibleRow[]): ViewTree => {
  const top: BrowserItem[] = [];
  const held = new Map<string, BrowserItem[]>();
  for (const row of rows) {
    if (row.expanded !== null) {
      top.push(row.item);
      held.set(row.item.key, []);
    } else if (row.depth === 0) top.push(row.item);
    else held.get(top.at(-1)?.key ?? '')?.push(row.item);
  }
  return { top, childrenOf: (item) => (item.role === 'group' ? (held.get(item.key) ?? []) : undefined) };
};

export { listNest };
