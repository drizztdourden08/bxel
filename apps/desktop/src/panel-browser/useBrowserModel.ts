/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import { thumbStore } from '../asset-thumbs/thumb-store';
import type { BrowserSource } from '../project-browser/browser-model.type';
import type { OpenProject } from '../project/project.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from '../workspace/key-id';
import { buildItemTree } from './build-item-tree';
import { buildStatuses } from './build-statuses';
import { NO_REFERRERS } from './project-browser.constants';
import type { BrowserRoot } from './project-browser.type';
import type { BrowserModel } from './browser-state.type';
import { referrerMap } from './referrer-map';

const rootsOf = (project: OpenProject | null): readonly BrowserRoot[] =>
  (project?.folders ?? []).map((folder, index) => ({ path: folder.path, name: folder.name, main: index === 0, granted: folder.granted }));

const useBrowserModel = (project: OpenProject | null, source: BrowserSource): BrowserModel => {
  const tabs = useWorkspaceStore((state) => state.tabs);
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const { artwork, rows, folders, files } = source;
  useEffect(() => thumbStore.setArtwork(artwork ?? undefined), [artwork]);
  const roots = useMemo(() => rootsOf(project), [project]);
  const referrers = useMemo(() => (artwork ? referrerMap(artwork, rows) : NO_REFERRERS), [artwork, rows]);
  const tree = useMemo(() => buildItemTree({ roots, folders, files, rows, listed: source.live && files.length > 0 }), [roots, folders, files, rows, source.live]);
  const openKeys = useMemo(() => new Set(tabs.map((tab) => keyId(tab.key))), [tabs]);
  const active = tabs.find((tab) => tab.id === activeTab);
  const activeKey = active ? keyId(active.key) : null;
  const statuses = useMemo(() => buildStatuses({ tree, referrers, openKeys, activeKey }), [tree, referrers, openKeys, activeKey]);
  return { tree, rows, statuses, referrers, activeKey, artwork, ready: source.live, truncated: false };
};

export { useBrowserModel };
