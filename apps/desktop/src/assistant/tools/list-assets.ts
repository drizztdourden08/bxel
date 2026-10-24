/* @layer renderer-app @kind logic */
import { canSeeFolder, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { assetEntry } from './asset-entry';
import { assistantRows } from './assistant-rows';
import { grantedProjects } from './granted-projects';
import { narrowAssets } from './narrow-assets';
import { reply } from './reply';
import type { ListAssetsInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const listAssets: ToolHandler = async (input, context) => {
  const request = input as ListAssetsInput;
  const found = grantedProjects(context).find((each) => each.project.manifest.projectId === request.projectId);
  if (!found) return reply(hiddenFailure('project'));
  const { project } = found;
  const { folderId } = request;
  const hidden = folderId !== undefined && !(project.folders.some((folder) => folder.folderId === folderId) && canSeeFolder(project.manifest.assistant.folders, folderId));
  if (hidden) return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: 'folderId' }));
  const rows = narrowAssets(await assistantRows(context, found), project, request);
  const end = request.offset + request.limit;
  return reply({
    ok: true,
    projectId: request.projectId,
    assets: rows.slice(request.offset, end).map((row) => assetEntry(project, row)),
    total: rows.length,
    notOpened: rows.filter((row) => !row.loaded).length,
    truncated: rows.length > end,
  });
};

export { listAssets };
