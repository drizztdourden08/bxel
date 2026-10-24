/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { CANCELLED } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { manifestWithMeta } from '../project-meta/manifest-with-meta';
import { saveManifest } from '../project/save-manifest';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { dirtyKeys } from './dirty-keys';
import { givePaths } from './give-paths';
import { keyId } from './key-id';
import { settleEngine } from './settle-engine';
import { trashRemoved } from './trash-removed';
import { WORKSPACE_TEXT } from './workspace.constants';
import { workspaceTarget } from './workspace-target';
import type { DirtyKeys, Workspace } from './workspace.type';
import { writeAssets } from './write-assets';

const saveProjectFile = async (kit: FileKit, documentId: DocumentId, workspace: Workspace, keys: DirtyKeys): Promise<number> => {
  const { project } = useProjectStore.getState();
  const artwork = kit.host.view(documentId)?.state.artwork;
  if (keys.project === null || workspace.kind !== 'project' || !project || !artwork) return 0;
  const paths = useWorkspaceStore.getState().workspaces[documentId]?.paths ?? workspace.paths;
  const next = manifestWithMeta(project.manifest, { artwork, paths, folders: project.folders });
  if (!(await saveManifest(next)).ok) return 0;
  const id = keyId(keys.project);
  useWorkspaceStore.getState().patch(documentId, (each) => ({ ...each, dirty: new Set([...each.dirty].filter((key) => key !== id)) }));
  return 1;
};

const prepare = async (kit: FileKit, documentId: DocumentId, keys: DirtyKeys): Promise<number | null> => {
  if (!(await givePaths(kit, documentId, keys.live))) return null;
  return keys.gone.length > 0 ? (await trashRemoved(kit, documentId, keys.gone)).length : 0;
};

const saveWorkspace = async (kit: FileKit, documentId: DocumentId): Promise<FileOutcome> => {
  const target = workspaceTarget(kit, documentId);
  if ('kind' in target) return target;
  const trashed = await prepare(kit, documentId, dirtyKeys(target.workspace, target.view.state.artwork));
  if (trashed === null) return CANCELLED;
  const fresh = useWorkspaceStore.getState().workspaces[documentId] ?? target.workspace;
  const keys = dirtyKeys(fresh, kit.host.view(documentId)?.state.artwork ?? target.view.state.artwork);
  const written = await writeAssets(kit, documentId, keys.live);
  const project = await saveProjectFile(kit, documentId, fresh, keys);
  settleEngine(kit.host, documentId);
  const saved = written.length + project;
  const path = fresh.projectFile ?? written[0]?.path ?? '';
  return { kind: 'done', path, notice: saved + trashed === 0 ? WORKSPACE_TEXT.nothingToSave : WORKSPACE_TEXT.saved(saved) };
};

export { saveWorkspace };
