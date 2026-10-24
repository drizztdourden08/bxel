/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { adoptPath } from '../../workspace/adopt-path';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import { toSlashes } from '../../workspace/to-slashes';
import type { ToolContext } from '../assistant.type';
import { assetFor } from './asset-for';
import { copyAssetTo } from './copy-asset-to';
import { reply } from './reply';
import type { SaveInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const moves = (target: SaveInput['target']): boolean => typeof target === 'object' && target.moveAsset;

const saveAssetAt = async (context: ToolContext, documentId: DocumentId, path: string, save: SaveInput): Promise<ToolReply | string> => {
  const key = assetFor(context, documentId, path, save.asset);
  if (!key) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.noAssetOfKind, { path: 'target' }));
  const hasFile = useWorkspaceStore.getState().workspaces[documentId]?.paths.has(key.id) ?? false;
  if (hasFile && !moves(save.target)) return copyAssetTo(context, documentId, key, path);
  adoptPath(context.host, documentId, key, toSlashes(path));
  const outcome = await saveTab(toolKit(context), tabOf(documentId, key), true);
  if (outcome.kind === 'done') return outcome.path;
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(outcome.kind === 'failed' ? outcome.message : ''), { path: 'target' }));
};

export { saveAssetAt };
