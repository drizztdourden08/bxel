/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { failed } from '../files/failed';
import { FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { WORKSPACE_TEXT } from './workspace.constants';
import type { WorkspaceTarget } from './workspace.type';

const workspaceTarget = (kit: FileKit, documentId: DocumentId): WorkspaceTarget | FileOutcome => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = kit.host.view(documentId);
  if (!workspace || !view) return failed(FILE_TEXT.noDocument);
  if (workspace.legacy !== null || view.state.readOnly) return failed(WORKSPACE_TEXT.olderFileLocked);
  return { workspace, view };
};

export { workspaceTarget };
