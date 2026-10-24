/* @layer renderer-app @kind logic */
import type { DocumentEvent } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { changedKeys } from './changed-keys';
import { focusTab } from './focus-tab';
import { settleEngine } from './settle-engine';
import { tabOf } from './tab-of';
import { touchedName } from './touched-name';
import { trackChange } from './track-change';
import { trackSteps } from './track-steps';

const followHistory = (event: DocumentEvent): void => {
  const view = useDocumentStore.getState().host.view(event.documentId);
  const key = view ? changedKeys(event.changes, view.state.artwork, () => true)[0] : undefined;
  if (!key) return;
  const tab = tabOf(event.documentId, key);
  if (useWorkspaceStore.getState().activeTab !== tab.id) focusTab(tab);
};

const openAdded = (event: DocumentEvent): void => {
  const view = useDocumentStore.getState().host.view(event.documentId);
  if (!view) return;
  for (const key of changedKeys(event.changes, view.state.artwork, (change) => change.kind === 'added')) {
    useWorkspaceStore.getState().addTab(tabOf(event.documentId, key));
  }
};

const onWorkspaceEvent = (event: DocumentEvent): void => {
  if (event.kind === 'open' || event.kind === 'save') return;
  const view = useDocumentStore.getState().host.view(event.documentId);
  const store = useWorkspaceStore.getState();
  if (!view || !store.workspaces[event.documentId]) return;
  store.patch(event.documentId, (workspace) => {
    const name = event.kind === 'commit' ? touchedName(workspace, event.changes, view.state.artwork) : '';
    return { ...trackChange(workspace, event.changes, view.state.artwork), steps: trackSteps(workspace.steps, event.kind, name) };
  });
  settleEngine(useDocumentStore.getState().host, event.documentId);
  if (event.kind === 'commit') openAdded(event);
  else followHistory(event);
};

export { onWorkspaceEvent };
