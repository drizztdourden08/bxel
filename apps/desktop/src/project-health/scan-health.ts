/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyOf } from '../workspace/key-of';
import { scanLinkIndex } from '../workspace/scan-link-index';
import { buildHealth } from './build-health';
import type { HealthState } from './project-health.type';

const unsavedFiles = (): number => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project');
  return workspace === undefined ? 0 : [...workspace.dirty].filter((id) => keyOf(id)?.kind !== 'project').length;
};

/** The checks of the open project, on the files as they are on disk now. Returns null when no project is open. */
const scanHealth = async (): Promise<Extract<HealthState, { status: 'ready' }> | null> => {
  const kit = fileKit();
  const { project } = useProjectStore.getState();
  if (!kit || !project) return null;
  const index = await scanLinkIndex(kit.documents, project);
  return { status: 'ready', index, report: buildHealth(index, { project, unsaved: unsavedFiles() }) };
};

export { scanHealth };
