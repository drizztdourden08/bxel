/* @layer renderer-app @kind logic */
import { pushRecentProject } from '@bxel/project';
import type { ProjectManifest } from '@bxel/project';
import { useProjectStore } from '../stores/useProjectStore';

const rememberProject = (manifest: ProjectManifest, rootRealPath: string): void => {
  const { port } = useProjectStore.getState();
  if (!port) return;
  const entry = { projectId: manifest.projectId, name: manifest.name, rootRealPath, openedAt: new Date().toISOString() };
  port.patch({ projectRecents: pushRecentProject(port.read().projectRecents, entry) });
};

export { rememberProject };
