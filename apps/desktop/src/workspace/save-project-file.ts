/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { manifestWithMeta } from '../project-meta/manifest-with-meta';
import { saveManifest } from '../project/save-manifest';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from './key-id';
import type { DirtyKeys, Workspace } from './workspace.type';

const saveProjectFile = async (kit: FileKit, documentId: DocumentId, workspace: Workspace, keys: DirtyKeys): Promise<number | string> => {
  const { project } = useProjectStore.getState();
  const artwork = kit.host.view(documentId)?.state.artwork;
  if (keys.project === null || workspace.kind !== 'project' || !project || !artwork) return 0;
  const paths = useWorkspaceStore.getState().workspaces[documentId]?.paths ?? workspace.paths;
  const next = manifestWithMeta(project.manifest, { artwork, paths, folders: project.folders });
  const outcome = await saveManifest(next);
  if (!outcome.ok) return outcome.message;
  const id = keyId(keys.project);
  useWorkspaceStore.getState().patch(documentId, (each) => ({ ...each, dirty: new Set([...each.dirty].filter((key) => key !== id)) }));
  return 1;
};

export { saveProjectFile };
