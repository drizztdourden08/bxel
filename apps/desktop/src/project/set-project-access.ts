/* @layer renderer-app @kind logic */
import { isSamePath, setGrant } from '@bxel/project';
import type { AccessLevel } from '@bxel/project';
import { useProjectStore } from '../stores/useProjectStore';
import type { AccessTarget, ProjectPort } from './project.type';
import { saveManifest } from './save-manifest';

const isOpenProject = (target: AccessTarget): boolean => {
  const { project } = useProjectStore.getState();
  return project !== null && project.manifest.projectId === target.projectId && isSamePath(project.rootRealPath, target.rootRealPath);
};

const setProjectAccess = async (port: ProjectPort, target: AccessTarget, access: AccessLevel): Promise<void> => {
  const grant = { ...target, access, grantedAt: new Date().toISOString() };
  port.patch({ assistantProjects: setGrant(port.read().assistantProjects, grant) });
  const { project } = useProjectStore.getState();
  if (project && isOpenProject(target) && project.manifest.assistant.access !== access) {
    await saveManifest({ ...project.manifest, assistant: { access } });
  }
};

export { setProjectAccess };
