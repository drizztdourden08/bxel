/* @layer renderer-app @kind logic */
import { isSearching } from '../project-browser/is-searching';
import { matchEntry } from '../project-browser/match-entry';
import { NO_FACTS } from '../project-browser/project-browser.constants';
import type { FileEntry } from '../project-browser/project-browser.type';
import type { SearchState } from './browser-state.type';
import type { FilterContext } from './filter-tree.type';
import { EMPTY_STATUS } from './project-browser.constants';
import type { BrowserItem, FilterResult, ItemTree } from './project-browser.type';

const isFileLike = (item: BrowserItem): boolean => item.role === 'file' || item.role === 'ghost';

const onlyWords = ({ query, missing }: SearchState): boolean =>
  !missing && query.kinds.length + query.is.length + query.uses.length + query.usedBy.length + query.size.length + query.colours.length === 0 && query.inFolder === null;

const entryOf = (item: BrowserItem, context: FilterContext): FileEntry | null =>
  item.row === null ? null : { kind: 'file', id: item.row.id, row: item.row, facts: context.facts.get(item.row.id) ?? NO_FACTS, pinned: false, key: context.keys.get(item.row.id) ?? null };

const addWithAncestors = (tree: ItemTree, key: string, visible: Set<string>): void => {
  for (let at: string | null = key; at !== null && !visible.has(at); at = tree.items.get(at)?.parentKey ?? null) visible.add(at);
};

const holdsFile = (item: BrowserItem, search: SearchState, context: FilterContext): boolean => {
  const entry = entryOf(item, context);
  if (entry === null || !matchEntry(entry, search.query)) return false;
  return !search.missing || (context.statuses.get(item.key) ?? EMPTY_STATUS).missing.length > 0;
};

const holdsFolder = (item: BrowserItem, search: SearchState): boolean =>
  onlyWords(search) && item.role !== 'group' && search.query.words.length > 0 && search.query.words.every((word) => item.name.toLowerCase().includes(word));

const filterTree = (tree: ItemTree, search: SearchState, context: FilterContext): FilterResult | null => {
  if (!search.missing && !isSearching(search.query)) return null;
  const matches = new Set<string>();
  const visible = new Set<string>();
  for (const item of tree.items.values()) {
    const fileLike = isFileLike(item);
    if (!(fileLike ? holdsFile(item, search, context) : holdsFolder(item, search))) continue;
    if (fileLike) matches.add(item.key);
    addWithAncestors(tree, item.key, visible);
  }
  return { matches, visible };
};

export { filterTree };
