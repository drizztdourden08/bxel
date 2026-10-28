/* @layer renderer-app @kind logic */
import { isExpandable } from './is-expandable';
import type { BrowserItem, VisibleRow } from './project-browser.type';
import type { ViewTree } from './browser-state.type';

const flattenView = (view: ViewTree, expanded: ReadonlySet<string>, visible: ReadonlySet<string> | null): readonly VisibleRow[] => {
  const rows: VisibleRow[] = [];
  const walk = (items: readonly BrowserItem[], depth: number): void => {
    const shown = visible === null ? items : items.filter((item) => visible.has(item.key));
    shown.forEach((item, index) => {
      const open = isExpandable(item) && (visible !== null || expanded.has(item.key)) && !item.readOnly;
      rows.push({ item, depth, posinset: index + 1, setsize: shown.length, expanded: isExpandable(item) ? open : null });
      if (open) walk(view.childrenOf(item) ?? [], depth + 1);
    });
  };
  walk(view.top, 0);
  return rows;
};

export { flattenView };
