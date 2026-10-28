/* @layer renderer-app @kind logic */
import { isQueryEmpty } from './is-query-empty';
import { matchItem } from './match-item';
import type { BrowserItem, BrowserQuery, FilterResult, ItemTree, MatchContext } from './project-browser.type';

const onlyText = (query: BrowserQuery): boolean =>
  query.kinds.length === 0 && query.states.length === 0 && query.usedBy === null && query.inside === null;

const isFileLike = (item: BrowserItem): boolean => item.role === 'file' || item.role === 'ghost';

const addWithAncestors = (tree: ItemTree, key: string, visible: Set<string>): void => {
  for (let at: string | null = key; at !== null && !visible.has(at); at = tree.items.get(at)?.parentKey ?? null) visible.add(at);
};

const filterTree = (tree: ItemTree, query: BrowserQuery, context: MatchContext): FilterResult | null => {
  if (isQueryEmpty(query)) return null;
  const textOnly = onlyText(query);
  const matches = new Set<string>();
  const visible = new Set<string>();
  for (const item of tree.items.values()) {
    const fileLike = isFileLike(item);
    if (!fileLike && (!textOnly || item.role === 'group')) continue;
    if (!matchItem(item, query, context)) continue;
    if (fileLike) matches.add(item.key);
    addWithAncestors(tree, item.key, visible);
  }
  return { matches, visible };
};

export { filterTree };
