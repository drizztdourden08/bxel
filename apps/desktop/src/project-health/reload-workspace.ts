/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { reportOutcome } from '../files/report-outcome';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { closeWorkspace } from '../workspace/close-workspace';
import { loadProjectWorkspace } from '../workspace/load-project-workspace';
import { openPath } from '../workspace/open-path';
import { restoreTabs } from '../workspace/restore-tabs';
import { tabPath } from '../workspace/tab-path';

const openTabPaths = (documentId: DocumentId): readonly string[] =>
  useWorkspaceStore
    .getState()
    .tabs.filter((tab) => tab.documentId === documentId)
    .flatMap((tab) => tabPath(tab.id) ?? []);

const reloadProject = async (kit: FileKit, documentId: DocumentId): Promise<void> => {
  const { project } = useProjectStore.getState();
  const { activeTab } = useWorkspaceStore.getState();
  const open = openTabPaths(documentId);
  const active = activeTab === null ? null : (tabPath(activeTab) ?? null);
  if (!project || !(await closeWorkspace(documentId))) return;
  const reopened = await loadProjectWorkspace(kit, project);
  if (reopened !== null) restoreTabs(reopened, { open, active });
};

const reloadWorkspace = async (kit: FileKit, documentId: DocumentId, path: string): Promise<void> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  if (workspace?.kind === 'project') {
    await reloadProject(kit, documentId);
    return;
  }
  useDocumentStore.getState().host.close(documentId);
  reportOutcome(await openPath(kit, path), { kind: 'openPath', path });
};

export { reloadWorkspace };
