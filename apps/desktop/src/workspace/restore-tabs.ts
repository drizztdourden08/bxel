/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetKeys } from './asset-keys';
import { focusTab } from './focus-tab';
import { tabOf } from './tab-of';
import type { StoredTabs } from './stored-tabs.type';
import type { OpenTab } from './workspace.type';

const tabsAt = (documentId: DocumentId, paths: readonly string[]): readonly OpenTab[] => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const artwork = useDocumentStore.getState().host.view(documentId)?.state.artwork;
  if (!workspace || !artwork) return [];
  const keys = assetKeys(artwork);
  return paths.flatMap((path) => {
    const id = [...workspace.paths].find(([, known]) => isSamePath(known, path))?.[0];
    const key = keys.find((each) => each.id === id);
    return key ? [tabOf(documentId, key)] : [];
  });
};

const restoreTabs = (documentId: DocumentId, stored: StoredTabs | undefined): void => {
  const tabs = stored ? tabsAt(documentId, stored.open) : [];
  const first = tabs[0];
  if (!stored || !first) return;
  const store = useWorkspaceStore.getState();
  for (const tab of store.tabs.filter((each) => each.documentId === documentId)) store.closeTab(tab.id);
  for (const tab of tabs) store.addTab(tab);
  const active = tabsAt(documentId, stored.active === null ? [] : [stored.active])[0];
  focusTab(active ?? first);
};

export { restoreTabs };
