/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { filterTree } from './filter-tree';
import { listRows } from './list-rows';
import { NO_COLLAPSED } from './project-browser.constants';
import { usersOf } from './users-of';
import { visibleRows } from './visible-rows';
import { withCreateRow } from './with-create-row';
import type { BrowserRows, RowsHookInput, ViewMode } from './project-browser.type';

const modeFor = ({ view, query }: Pick<RowsHookInput, 'view' | 'query'>): ViewMode => {
  const listOnly = view.density === 'grid' || query.usedBy !== null || query.states.includes('unused');
  return view.mode === 'tree' && listOnly ? 'list' : view.mode;
};

const useBrowserRows = ({ model, view, query, create }: RowsHookInput): BrowserRows => {
  const { tree, statuses, referrers } = model;
  const users = useMemo(() => usersOf(tree, referrers, query.usedBy), [tree, referrers, query.usedBy]);
  const filter = useMemo(() => filterTree(tree, query, { statuses, users }), [tree, query, statuses, users]);
  const mode = modeFor({ view, query });
  const collapsed = view.density === 'grid' ? NO_COLLAPSED : view.collapsedGroups;
  const base = useMemo(
    () =>
      mode === 'tree'
        ? visibleRows({ tree, expanded: view.expandedSet, visible: filter?.visible ?? null })
        : listRows({ tree, matches: filter?.matches ?? null, collapsed, view }),
    [mode, tree, view, filter, collapsed],
  );
  const rows = useMemo(() => withCreateRow(base, create, tree), [base, create, tree]);
  const index = useMemo(() => new Map(rows.map((row) => [row.item.key, row.item] as const)), [rows]);
  const itemOf = useCallback((key: string) => index.get(key) ?? tree.items.get(key), [index, tree]);
  return { rows, mode, filtered: filter !== null, shown: filter?.matches.size ?? null, itemOf };
};

export { useBrowserRows };
