/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { failed } from '../files/failed';
import { CANCELLED, FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { saveManifest } from '../project/save-manifest';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { dirtyKeys } from './dirty-keys';
import { givePaths } from './give-paths';
import { keyId } from './key-id';
import { settleEngine } from './settle-engine';
import { trashRemoved } from './trash-removed';
import { WORKSPACE_TEXT } from './workspace.constants';
import { writeAssets } from './write-assets';

const saveProjectFile = async (documentId: DocumentId, key: string): Promise<number> => {
  const { project } = useProjectStore.getState();
  if (!project || !(await saveManifest(project.manifest)).ok) return 0;
  useWorkspaceStore.getState().patch(documentId, (workspace) => {
    const dirty = new Set(workspace.dirty);
    dirty.delete(key);
    return { ...workspace, dirty };
  });
  return 1;
};

const saveWorkspace = async (kit: FileKit, documentId: DocumentId): Promise<FileOutcome> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = kit.host.view(documentId);
  if (!workspace || !view) return failed(FILE_TEXT.noDocument);
  if (workspace.legacy !== null || view.state.readOnly) return failed(WORKSPACE_TEXT.readOnlyLegacy);
  const first = dirtyKeys(workspace, view.state.artwork);
  if (!(await givePaths(kit, documentId, first.live))) return CANCELLED;
  const trashed = first.gone.length > 0 ? await trashRemoved(kit, documentId, first.gone) : [];
  const fresh = useWorkspaceStore.getState().workspaces[documentId] ?? workspace;
  const keys = dirtyKeys(fresh, kit.host.view(documentId)?.state.artwork ?? view.state.artwork);
  const written = await writeAssets(kit, documentId, keys.live);
  const project = keys.project === null || fresh.kind !== 'project' ? 0 : await saveProjectFile(documentId, keyId(keys.project));
  settleEngine(kit.host, documentId);
  const count = written.length + trashed.length + project;
  const path = fresh.projectFile ?? written[0]?.path ?? '';
  return { kind: 'done', path, notice: count === 0 ? WORKSPACE_TEXT.nothingToSave : WORKSPACE_TEXT.saved(written.length + project) };
};

export { saveWorkspace };
