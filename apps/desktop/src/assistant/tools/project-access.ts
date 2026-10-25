/* @layer renderer-app @kind logic */
import { effectiveAccess } from '@bxel/mcp';
import type { ProjectAccess } from '@bxel/mcp';
import { effectiveGrant, parseGrants } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';
import type { ToolContext } from '../assistant.type';

const projectAccess = (context: ToolContext, project: OpenProject): ProjectAccess => {
  const { access } = effectiveGrant(project.manifest, project.rootRealPath, parseGrants(context.settings.assistantProjects));
  return effectiveAccess(context.call.session.mode, access);
};

export { projectAccess };
