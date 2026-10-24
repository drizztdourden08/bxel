/* @layer renderer-app @kind logic */
import { NO_PATHS } from '../asset-config/asset-config.constants';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { projectWorkspaceId } from '../workspace/project-workspace-id';
import type { ProjectFocus } from './project-config.type';

const focusedProject = (): ProjectFocus | null => {
  const { project } = useProjectStore.getState();
  if (!project) return null;
  const documentId = projectWorkspaceId();
  const artwork = documentId === null ? undefined : useDocumentStore.getState().host.view(documentId)?.state.artwork;
  const paths = documentId === null ? NO_PATHS : (useWorkspaceStore.getState().workspaces[documentId]?.paths ?? NO_PATHS);
  return { project, documentId, artwork, paths };
};

export { focusedProject };
