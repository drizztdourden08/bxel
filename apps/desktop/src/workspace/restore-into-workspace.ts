/* @layer renderer-app @kind logic */
import { computeChanges } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { assetName } from './asset-name';
import { firstTabKey } from './first-tab-key';
import { focusTab } from './focus-tab';
import { settleEngine } from './settle-engine';
import { tabOf } from './tab-of';
import { trackChange } from './track-change';
import type { OpenTab, Workspace } from './workspace.type';

const carriedTabs = (from: Workspace, documentId: DocumentId, artwork: Artwork): readonly OpenTab[] => {
  const kept = useWorkspaceStore.getState().tabs.filter((tab) => tab.documentId === from.documentId && assetName(artwork, tab.key) !== null);
  const first = firstTabKey(artwork);
  if (kept.length > 0) return kept.map((tab) => tabOf(documentId, tab.key));
  return first ? [tabOf(documentId, first)] : [];
};

const restoreIntoWorkspace = (host: DocumentHost, workspace: Workspace, artwork: Artwork): DocumentId | null => {
  const view = host.view(workspace.documentId);
  if (!view || !view.clean || workspace.dirty.size > 0) return null;
  const documentId = host.open({ artwork, readOnly: false, unsaved: true });
  const before = { ...workspace, documentId, last: view.state.artwork, steps: { undo: [], redo: [] } };
  const tabs = carriedTabs(workspace, documentId, artwork);
  useWorkspaceStore.getState().put(trackChange(before, computeChanges(view.state.artwork, artwork), artwork), tabs);
  host.close(workspace.documentId);
  const [first] = tabs;
  if (first) focusTab(first);
  settleEngine(host, documentId);
  return documentId;
};

export { restoreIntoWorkspace };
