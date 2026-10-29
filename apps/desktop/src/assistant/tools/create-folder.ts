/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { fileKit } from '../../files/file-kit';
import { reasonOf } from '../../files/reason-of';
import { checkEntryName } from '../../project/check-entry-name';
import type { ToolHandler } from '../assistant.type';
import { entryKindAt } from './entry-kind-at';
import { locateInProject } from './locate-in-project';
import { placePath } from './place-path';
import { planFailure } from './plan-failure';
import type { CreateFolderInput } from './project-files-input.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { visibleProject } from './visible-project';

const createFolder: ToolHandler = async (input, context) => {
  const request = input as CreateFolderInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const parent = placePath(visible, request.in, 'in');
  if (!parent.ok) return reply(parent);
  if (request.in.path !== undefined && (await entryKindAt(context.documents, parent.value)) !== 'folder') {
    return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: 'in' }));
  }
  const kit = fileKit();
  if (!kit) return reply(mcpFailure(MCP_ERROR_CODE.BRIDGE_ERROR, 'Folder access is not available here.'));
  const problem = await checkEntryName(kit.documents, parent.value, request.name);
  if (problem !== null) return reply(planFailure(problem, 'name'));
  const path = `${parent.value}/${request.name}`;
  try {
    await kit.documents.mkdir(path);
  } catch (error) {
    return reply(mcpFailure(MCP_ERROR_CODE.WRITE_NOT_ALLOWED, TOOL_TEXT.writeRefused(reasonOf(error))));
  }
  const folder = locateInProject(visible, path);
  return folder ? reply({ ok: true, projectId: request.projectId, folder }) : reply(mcpFailure(MCP_ERROR_CODE.PATH_INVALID, 'The folder is not in a place the assistant can see.'));
};

export { createFolder };
