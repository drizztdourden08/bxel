/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { DiskProject } from '../project-manager/project-manager.type';
import type { OpenProject } from '../project/project.type';
import { allFolders } from './all-folders';
import type { BrowserModel } from './browser-model.type';
import { buildEntries } from './build-entries';
import { crumbsOf } from './crumbs-of';
import { isSearching } from './is-searching';
import { keepShown } from './keep-shown';
import { parentFolderOf } from './parent-folder-of';
import { parseQuery } from './parse-query';
import { NO_FACTS } from './project-browser.constants';
import type { BrowserEntry, FileEntry } from './project-browser.type';
import { useBrowserSource } from './useBrowserSource';
import { useBrowserStore } from './useBrowserStore';

const useBrowserModel = (project: OpenProject | null, disk: DiskProject | null): BrowserModel => {
  const store = useBrowserStore();
  const source = useBrowserSource(project, disk);
  const { rows, facts, keys, roots, folders, projectName } = source;
  const query = useMemo(() => parseQuery(store.query), [store.query]);
  const pinned = useMemo(() => new Set(store.pinned), [store.pinned]);
  const folder = store.folder ?? (roots.length === 1 ? (roots[0]?.path ?? null) : null);
  const entriesIn = useCallback(
    (path: string | null, asked = parseQuery('')): readonly BrowserEntry[] => buildEntries({ rows, facts, keys, roots, folders, folder: path, query: asked, pinned, sort: store.sort }),
    [rows, facts, keys, roots, folders, pinned, store.sort],
  );
  const entries = useMemo(() => entriesIn(folder, query), [entriesIn, folder, query]);
  const order = useMemo(() => entries.map((entry) => entry.id), [entries]);
  const selection = useMemo(() => keepShown(store.selection, order), [store.selection, order]);
  const everyFile = useMemo(
    () => rows.map((row): FileEntry => ({ kind: 'file', id: row.id, row, facts: facts.get(row.id) ?? NO_FACTS, pinned: pinned.has(row.id), key: keys.get(row.id) ?? null })),
    [rows, facts, pinned, keys],
  );
  return {
    editable: source.live,
    projectName,
    artwork: source.artwork,
    roots,
    folder,
    crumbs: crumbsOf(projectName, roots, folder),
    entriesIn,
    folderPaths: useMemo(() => allFolders(folders, rows), [folders, rows]),
    entries,
    files: useMemo(() => entries.filter((entry): entry is FileEntry => entry.kind === 'file'), [entries]),
    everyFile,
    order,
    selected: useMemo(() => entries.filter((entry) => selection.ids.includes(entry.id)), [entries, selection]),
    query,
    searching: isSearching(query),
    unsaved: rows.filter((row) => row.dirty).length,
    total: rows.length,
    parentFolder: parentFolderOf(roots, folder),
    refresh: source.refresh,
  };
};

export { useBrowserModel };
