/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { buildRows } from '../asset-list/build-rows';
import { diskRows } from '../project-manager/disk-rows';
import type { DiskProject } from '../project-manager/project-manager.type';
import type { OpenProject } from '../project/project.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { toSlashes } from '../workspace/to-slashes';
import { assetKeys } from '../workspace/asset-keys';
import { keyId } from '../workspace/key-id';
import type { AssetKey } from '@bxel/document';
import type { BrowserModel } from './browser-model.type';
import { buildEntries } from './build-entries';
import { crumbsOf, parentFolderOf } from './crumbs-of';
import { isSearching, parseQuery } from './parse-query';
import type { BrowserEntry, BrowserFacts, FileEntry, FolderEntry, SourceRoot } from './project-browser.type';
import { NO_FACTS, rowFacts } from './row-facts';
import { keepShown } from './selection';
import { useBrowserStore } from './useBrowserStore';
import { useProjectTree } from './useProjectTree';

const rootsOf = (folders: readonly { readonly path: string; readonly name: string }[]): readonly SourceRoot[] =>
  folders.map((folder, at) => ({ path: toSlashes(folder.path), name: folder.name, linked: at > 0 }));

/** Everything the Browse page shows for one project, open (live) or closed (read only, from disk). */
const useBrowserModel = (project: OpenProject | null, disk: DiskProject | null): BrowserModel => {
  const store = useBrowserStore();
  const { tree, refresh } = useProjectTree(project);
  const workspace = useWorkspaceStore((state) => Object.values(state.workspaces).find((each) => each.kind === 'project'));
  const tabs = useWorkspaceStore((state) => state.tabs);
  const artwork = useDocumentStore((state) => (workspace ? state.views[workspace.documentId]?.state.artwork : undefined)) ?? null;
  const live = project !== null && workspace !== undefined && artwork !== null;

  const roots = useMemo(
    () => rootsOf(live ? project.folders.filter((folder) => folder.granted) : (disk?.folders ?? [])),
    [live, project, disk],
  );
  const rows = useMemo(() => (live ? buildRows({ workspace, artwork, files: tree.files }) : disk ? diskRows(disk) : []), [live, workspace, artwork, tree.files, disk]);
  const { facts, keys } = useMemo(() => {
    const open = new Set(tabs.map((tab) => keyId(tab.key)));
    const factOf = new Map<string, BrowserFacts>();
    const keyOf = new Map<string, AssetKey>();
    if (!live) return { facts: factOf, keys: keyOf };
    const held = new Map(assetKeys(artwork).map((key) => [key.id, key] as const));
    for (const row of rows) {
      const key = row.assetId === null ? undefined : held.get(row.assetId);
      if (key) {
        keyOf.set(row.id, key);
        factOf.set(row.id, rowFacts(artwork, key, open.has(keyId(key))));
      } else factOf.set(row.id, NO_FACTS);
    }
    return { facts: factOf, keys: keyOf };
  }, [live, artwork, rows, tabs]);

  const query = useMemo(() => parseQuery(store.query), [store.query]);
  const pinned = useMemo(() => new Set(store.pinned), [store.pinned]);
  const single = roots.length === 1 ? roots[0]?.path : undefined;
  const folder = store.folder ?? single ?? null;
  const entries = useMemo(
    () => buildEntries({ rows, facts, keys, roots, folders: tree.folders, folder, query, pinned, sort: store.sort }),
    [rows, facts, keys, roots, tree.folders, folder, query, pinned, store.sort],
  );
  const files = useMemo(() => entries.filter((entry): entry is FileEntry => entry.kind === 'file'), [entries]);
  const order = useMemo(() => entries.map((entry) => entry.id), [entries]);
  const selection = useMemo(() => keepShown(store.selection, order), [store.selection, order]);
  const selected = useMemo(() => entries.filter((entry) => selection.ids.includes(entry.id)), [entries, selection]);
  const projectName = (live ? project.manifest.name : disk?.manifest.name) ?? '';
  const everyFile = useMemo(
    () => rows.map((row): FileEntry => ({ kind: 'file', id: row.id, row, facts: facts.get(row.id) ?? NO_FACTS, pinned: pinned.has(row.id), key: keys.get(row.id) ?? null })),
    [rows, facts, pinned, keys],
  );
  const siblings = useCallback(
    (path: string | null): readonly FolderEntry[] =>
      buildEntries({ rows, facts, keys, roots, folders: tree.folders, folder: path, query: parseQuery(''), pinned, sort: store.sort }).filter((entry): entry is FolderEntry => entry.kind === 'folder'),
    [rows, facts, keys, roots, tree.folders, pinned, store.sort],
  );

  return {
    editable: live,
    projectName,
    artwork: live ? artwork : null,
    roots,
    folder,
    crumbs: crumbsOf(projectName, roots, folder),
    siblings,
    entries: entries as readonly BrowserEntry[],
    files,
    everyFile,
    order,
    selected,
    query,
    searching: isSearching(query),
    unsaved: rows.filter((row) => row.dirty).length,
    total: rows.length,
    parentFolder: parentFolderOf(roots, folder),
    refresh,
  };
};

export { useBrowserModel };
