/* @layer renderer-app @kind logic */
import { isExpandable } from './is-expandable';
import type { ItemTree, RowsInput, VisibleRow } from './project-browser.type';

const topKeys = (tree: ItemTree): readonly string[] => {
  const top = tree.children.get(null) ?? [];
  const inside = tree.mainKey === null ? [] : (tree.children.get(tree.mainKey) ?? []);
  return [...inside, ...top.filter((key) => key !== tree.mainKey)];
};

const visibleRows = ({ tree, expanded, visible }: RowsInput): readonly VisibleRow[] => {
  const rows: VisibleRow[] = [];
  const walk = (keys: readonly string[], depth: number): void => {
    const shown = visible === null ? keys : keys.filter((key) => visible.has(key));
    shown.forEach((key, index) => {
      const item = tree.items.get(key);
      if (item === undefined) return;
      const open = isExpandable(item) && (visible !== null || expanded.has(key)) && !item.readOnly && !item.failed;
      rows.push({ item, depth, posinset: index + 1, setsize: shown.length, expanded: isExpandable(item) ? open : null });
      if (open) walk(tree.children.get(key) ?? [], depth + 1);
    });
  };
  walk(topKeys(tree), 0);
  return rows;
};

export { visibleRows };
