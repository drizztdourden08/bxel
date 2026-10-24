/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { showAsset } from './show-asset';
import type { OpenTab } from './workspace.type';

const focusTab = (tab: OpenTab): void => {
  const workspaces = useWorkspaceStore.getState();
  workspaces.addTab(tab);
  workspaces.setActiveTab(tab.id);
  const documents = useDocumentStore.getState();
  if (documents.activeId !== tab.documentId) documents.setActive(tab.documentId);
  showAsset(tab.key);
};

export { focusTab };
