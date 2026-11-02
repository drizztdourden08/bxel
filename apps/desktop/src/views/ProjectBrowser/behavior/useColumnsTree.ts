/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useRef } from 'react';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import type { ColumnsTree } from './useColumnsTree.type';

const useColumnsTree = (model: BrowserModel): ColumnsTree => {
  const { entriesIn, crumbs } = model;
  const head = crumbs[0]?.path ?? null;
  const cache = useMemo(() => new Map<string, readonly BrowserEntry[]>(), [entriesIn]);
  const items = useMemo(() => entriesIn(head), [entriesIn, head]);
  const pending = useRef<ReadonlySet<string>>(new Set());

  const childrenOf = useCallback(
    (entry: BrowserEntry): readonly BrowserEntry[] | undefined => {
      if (entry.kind !== 'folder') return undefined;
      const known = cache.get(entry.path);
      if (known) return known;
      const found = entriesIn(entry.path);
      cache.set(entry.path, found);
      return found;
    },
    [cache, entriesIn],
  );

  const isFolder = useCallback(
    (key: string): boolean => items.some((entry) => entry.kind === 'folder' && entry.id === key) || [...cache.values()].some((list) => list.some((entry) => entry.kind === 'folder' && entry.id === key)),
    [items, cache],
  );

  const path = useMemo(() => crumbs.slice(1).map((crumb) => crumb.path ?? ''), [crumbs]);

  const pick = useCallback((next: ReadonlySet<string>): void => {
    pending.current = next;
    const ids = [...next];
    useBrowserStore.getState().select({ ids, anchor: ids[0] ?? null });
  }, []);

  const walk = useCallback(
    (next: readonly string[]): void => {
      const last = next.at(-1);
      const folder = last !== undefined && isFolder(last) ? last : (next.at(-2) ?? head);
      const store = useBrowserStore.getState();
      store.goTo(folder);
      if (pending.current.size > 0) store.select({ ids: [...pending.current], anchor: [...pending.current][0] ?? null });
    },
    [isFolder, head],
  );

  return { items, childrenOf, path, pick, walk };
};

export { useColumnsTree };
