/* @layer renderer-app @kind logic */
import type { HostChange } from '../documents/document-host.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { looseSeed } from './loose-seed';
import { tabOf } from './tab-of';
import { workspaceOf } from './workspace-of';

const onHostChange = (change: HostChange): void => {
  const store = useWorkspaceStore.getState();
  if (change.kind === 'close') {
    store.drop(change.documentId);
    return;
  }
  if (store.workspaces[change.documentId]) return;
  const view = useDocumentStore.getState().host.view(change.documentId);
  if (!view) return;
  const seed = looseSeed(view.state.artwork, !view.clean, view.state.readOnly);
  const tab = seed.focus ? tabOf(change.documentId, seed.focus) : null;
  store.put(workspaceOf(change.documentId, seed), tab ? [tab] : []);
  if (tab) store.setActiveTab(tab.id);
};

export { onHostChange };
