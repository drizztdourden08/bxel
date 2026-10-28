/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import { thumbStore } from '../asset-thumbs/thumb-store';
import { buildRows } from '../asset-list/build-rows';
import type { ListedFile } from '../asset-list/asset-list.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from '../workspace/key-id';
import { buildItemTree } from './build-item-tree';
import { buildStatuses } from './build-statuses';
import { referrerMap } from './referrer-map';
import { NO_REFERRERS } from './project-browser.constants';
import type { BrowserModel, BrowserSource } from './project-browser.type';

const filesOf = (source: BrowserSource): readonly ListedFile[] =>
  source.entries.filter((entry) => !entry.isFolder).map((entry) => ({ path: entry.path, name: entry.name, modified: entry.modified, size: entry.size }));

const useBrowserModel = (source: BrowserSource): BrowserModel => {
  const workspace = useWorkspaceStore((state) => Object.values(state.workspaces).find((each) => each.kind === 'project'));
  const tabs = useWorkspaceStore((state) => state.tabs);
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const artwork = useDocumentStore((state) => (workspace ? state.views[workspace.documentId]?.state.artwork : undefined));
  useEffect(() => thumbStore.setArtwork(artwork), [artwork]);
  const files = useMemo(() => filesOf(source), [source]);
  const rows = useMemo(() => (workspace && artwork ? buildRows({ workspace, artwork, files }) : []), [workspace, artwork, files]);
  const referrers = useMemo(() => (artwork ? referrerMap(artwork, rows) : NO_REFERRERS), [artwork, rows]);
  const tree = useMemo(
    () => buildItemTree({ roots: source.roots, entries: source.entries, failed: source.failed, rows, listed: source.ready }),
    [source, rows],
  );
  const mine = useMemo(() => tabs.filter((tab) => tab.documentId === workspace?.documentId), [tabs, workspace]);
  const openKeys = useMemo(() => new Set(mine.map((tab) => keyId(tab.key))), [mine]);
  const active = mine.find((tab) => tab.id === activeTab);
  const activeKey = active ? keyId(active.key) : null;
  const statuses = useMemo(() => buildStatuses({ tree, referrers, openKeys, activeKey }), [tree, referrers, openKeys, activeKey]);
  return { tree, rows, statuses, referrers, activeKey, documentId: workspace?.documentId ?? null };
};

export { useBrowserModel };
