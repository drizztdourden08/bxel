/* @layer renderer-app @kind logic */
import { effectiveGrant, parseGrants } from '@bxel/project';
import { useProjectStore } from '../../stores/useProjectStore';
import type { GrantedProject, ToolContext } from '../assistant.type';

const grantedProjects = (context: ToolContext): readonly GrantedProject[] => {
  const { project } = useProjectStore.getState();
  if (!project) return [];
  const grants = parseGrants(context.settings.assistantProjects);
  const { access } = effectiveGrant(project.manifest, project.rootRealPath, grants);
  return access === 'off' ? [] : [{ project, access }];
};

export { grantedProjects };
