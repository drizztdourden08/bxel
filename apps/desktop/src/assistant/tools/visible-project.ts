/* @layer renderer-app @kind logic */
import { canSeeFolder, checkProjectAccess, checkWrite, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { grantedProjects } from './granted-projects';
import { projectAccess } from './project-access';
import type { VisibleProject } from './project-files-input.type';
import { TOOL_TEXT } from './tools.constants';

const visibleProject = (context: ToolContext, projectId: string, writes: boolean): McpResult<VisibleProject> => {
  const found = grantedProjects(context).find((each) => each.project.manifest.projectId === projectId);
  if (!found) return hiddenFailure('project');
  if (writes) {
    const denied = checkProjectAccess(projectAccess(context, found.project), 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
    if (denied) return denied;
    if (!found.open) return mcpFailure(MCP_ERROR_CODE.NEEDS_OWNER, TOOL_TEXT.projectNotOpen);
  }
  const { project } = found;
  const folders = project.folders.filter((folder) => folder.granted && canSeeFolder(project.manifest.assistant.folders, folder.folderId));
  return { ok: true, value: { found, visible: { ...project, folders } } };
};

export { visibleProject };
