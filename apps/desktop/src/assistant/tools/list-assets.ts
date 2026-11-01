/* @layer renderer-app @kind logic */
import { canSeeFolder, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import type { ToolHandler } from '../assistant.type';
import { assetEntry } from './asset-entry';
import { NO_LINKS } from './asset-states.constants';
import { statesOf } from './asset-states';
import { linksByAsset } from './links-by-asset';
import type { AssetLinks } from './asset-states.type';
import { assistantRows } from './assistant-rows';
import { grantedProjects } from './granted-projects';
import { narrowAssets } from './narrow-assets';
import { reply } from './reply';
import type { ListAssetsInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { visibleProject } from './visible-project';

const listAssets: ToolHandler = async (input, context) => {
  const request = input as ListAssetsInput;
  const found = grantedProjects(context).find((each) => each.project.manifest.projectId === request.projectId);
  if (!found) return reply(hiddenFailure('project'));
  const { project } = found;
  const { folderId } = request;
  const hidden = folderId !== undefined && !(project.folders.some((folder) => folder.folderId === folderId) && canSeeFolder(project.manifest.assistant.folders, folderId));
  if (hidden) return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.noFolder, { path: 'folderId' }));
  const wanted = request.states ?? [];
  let links: ReadonlyMap<string, AssetLinks> | null = null;
  if (request.withLinks === true || wanted.includes('missing')) {
    const scope = visibleProject(context, request.projectId, false);
    if (!scope.ok) return reply(scope);
    links = linksByAsset(await scanLinkIndex(context.documents, scope.value.visible));
  }
  const linksOf = (assetId: string | null): AssetLinks | null => (links === null ? null : ((assetId === null ? undefined : links.get(assetId)) ?? NO_LINKS));
  const narrowed = narrowAssets(await assistantRows(context, found), project, request);
  const rows = narrowed.filter((row) => wanted.every((state) => statesOf(row, linksOf(row.assetId)).includes(state)));
  const end = request.offset + request.limit;
  return reply({
    ok: true,
    projectId: request.projectId,
    assets: rows.slice(request.offset, end).map((row) => assetEntry(project, row, linksOf(row.assetId))),
    total: rows.length,
    notOpened: rows.filter((row) => !row.loaded).length,
    truncated: rows.length > end,
  });
};

export { listAssets };
