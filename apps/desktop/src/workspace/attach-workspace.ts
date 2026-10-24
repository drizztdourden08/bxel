/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusTab } from './focus-tab';
import { tabOf } from './tab-of';
import { workspaceOf } from './workspace-of';
import type { WorkspaceSeed } from './workspace.type';

const attachWorkspace = (host: DocumentHost, seed: WorkspaceSeed): DocumentId => {
  const documentId = host.open({ artwork: seed.artwork, readOnly: seed.readOnly, unsaved: seed.unsaved });
  const tab = seed.focus ? tabOf(documentId, seed.focus) : null;
  useWorkspaceStore.getState().put(workspaceOf(documentId, seed), tab ? [tab] : []);
  if (tab) focusTab(tab);
  return documentId;
};

export { attachWorkspace };
