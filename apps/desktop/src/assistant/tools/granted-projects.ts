/* @layer renderer-app @kind logic */
import { effectiveGrant, parseGrants } from '@bxel/project';
import type { ProjectGrant } from '@bxel/project';
import { sameProject } from '../../project/same-project';
import type { OpenProject } from '../../project/project.type';
import { useProjectStore } from '../../stores/useProjectStore';
import type { GrantedProject, ToolContext } from '../assistant.type';

const grantOf = (project: OpenProject, grants: readonly ProjectGrant[], open: boolean): readonly GrantedProject[] => {
  const { access } = effectiveGrant(project.manifest, project.rootRealPath, grants);
  return access === 'off' ? [] : [{ project, access, open }];
};

const grantedProjects = (context: ToolContext): readonly GrantedProject[] => {
  const { project, held } = useProjectStore.getState();
  const grants = parseGrants(context.settings.assistantProjects);
  const kept = held.filter((each) => !project || !sameProject(each, project));
  return [...(project ? grantOf(project, grants, true) : []), ...kept.flatMap((each) => grantOf(each, grants, false))];
};

export { grantedProjects };
