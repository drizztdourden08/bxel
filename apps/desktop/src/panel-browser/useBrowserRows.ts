/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { filterTree } from './filter-tree';
import { flattenView } from './flatten-view';
import { listRows } from './list-rows';
import { listNest } from './list-nest';
import { NO_COLLAPSED } from './project-browser.constants';
import { treeNest } from './tree-nest';
import type { ViewMode } from './project-browser.type';
import type { BrowserRows, RowsInput } from './browser-state.type';

const modeFor = ({ view, search }: Pick<RowsInput, 'view' | 'search'>): ViewMode => {
  const { query } = search;
  const listOnly = view.density === 'grid' || query.uses.length > 0 || query.usedBy.length > 0 || query.is.includes('unused');
  return view.mode === 'tree' && listOnly ? 'list' : view.mode;
};

const useBrowserRows = ({ model, view, search, create, facts, keys }: RowsInput): BrowserRows => {
  const { tree, statuses } = model;
  const filter = useMemo(() => filterTree(tree, search, { statuses, facts, keys }), [tree, search, statuses, facts, keys]);
  const mode = modeFor({ view, search });
  const collapsed = view.density === 'grid' ? NO_COLLAPSED : view.collapsedGroups;
  const listed = useMemo(() => listRows({ tree, matches: filter?.matches ?? null, collapsed, view }), [tree, filter, collapsed, view]);
  const nested = useMemo(() => (mode === 'tree' ? treeNest(tree, create) : listNest(listed)), [mode, tree, create, listed]);
  const visible = mode === 'tree' ? (filter?.visible ?? null) : null;
  const rows = useMemo(() => (mode === 'tree' ? flattenView(nested, view.expandedSet, visible) : listed), [mode, nested, view.expandedSet, visible, listed]);
  const itemOf = useCallback((key: string) => tree.items.get(key) ?? nested.top.find((each) => each.key === key), [tree, nested]);
  return { rows, nested, mode, filtered: filter !== null, shown: filter?.matches.size ?? null, visible, itemOf };
};

export { useBrowserRows };
