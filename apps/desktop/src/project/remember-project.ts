/* @layer renderer-app @kind logic */
import { pushRecentProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { useProjectStore } from '../stores/useProjectStore';

const rememberProject = (manifest: ProjectDocument, rootRealPath: string): void => {
  const { port } = useProjectStore.getState();
  if (!port) return;
  const entry = { projectId: manifest.projectId, name: manifest.name, rootRealPath, openedAt: new Date().toISOString() };
  port.patch({ projectRecents: pushRecentProject(port.read().projectRecents, entry) });
};

export { rememberProject };
