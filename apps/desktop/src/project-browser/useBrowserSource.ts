/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { buildRows } from '../asset-list/build-rows';
import { diskRows } from '../project-manager/disk-rows';
import type { DiskProject } from '../project-manager/project-manager.type';
import type { OpenProject } from '../project/project.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { toSlashes } from '../workspace/to-slashes';
import type { BrowserSource } from './browser-model.type';
import { factsAndKeys } from './facts-and-keys';
import { NO_FACTS, NO_KEYS } from './project-browser.constants';
import type { SourceRoot } from './project-browser.type';
import { useProjectTree } from './useProjectTree';

const rootsOf = (folders: readonly { readonly path: string; readonly name: string }[]): readonly SourceRoot[] =>
  folders.map((folder, at) => ({ path: toSlashes(folder.path), name: folder.name, linked: at > 0 }));

const useBrowserSource = (project: OpenProject | null, disk: DiskProject | null): BrowserSource => {
  const { tree, refresh } = useProjectTree(project);
  const workspace = useWorkspaceStore((state) => Object.values(state.workspaces).find((each) => each.kind === 'project'));
  const tabs = useWorkspaceStore((state) => state.tabs);
  const artwork = useDocumentStore((state) => (workspace ? state.views[workspace.documentId]?.state.artwork : undefined)) ?? null;
  const live = project !== null && workspace !== undefined && artwork !== null;
  const roots = useMemo(() => rootsOf(live ? project.folders.filter((folder) => folder.granted) : (disk?.folders ?? [])), [live, project, disk]);
  const rows = useMemo(() => {
    if (live) return buildRows({ workspace, artwork, files: tree.files });
    return disk ? diskRows(disk) : [];
  }, [live, workspace, artwork, tree.files, disk]);
  const known = useMemo(() => (live ? factsAndKeys(artwork, rows, tabs) : { facts: new Map(rows.map((row) => [row.id, NO_FACTS] as const)), keys: NO_KEYS }), [live, artwork, rows, tabs]);
  return {
    live,
    artwork: live ? artwork : null,
    roots,
    rows,
    facts: known.facts,
    keys: known.keys,
    folders: tree.folders,
    refresh,
    projectName: (live ? project.manifest.name : disk?.manifest.name) ?? '',
  };
};

export { useBrowserSource };
