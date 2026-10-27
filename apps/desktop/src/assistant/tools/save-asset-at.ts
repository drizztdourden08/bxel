/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { adoptPath } from '../../workspace/adopt-path';
import { parentOf } from '../../workspace/parent-of';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import { toSlashes } from '../../workspace/to-slashes';
import type { ToolContext } from '../assistant.type';
import { assetFor } from './asset-for';
import { checkAssetSave } from './check-asset-save';
import { copyAssetTo } from './copy-asset-to';
import { reply } from './reply';
import { savedDependencies } from './saved-dependencies';
import type { SaveInput, SavedAt } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const moves = (target: SaveInput['target']): boolean => typeof target === 'object' && target.moveAsset;

const copiedTo = async (context: ToolContext, documentId: DocumentId, key: AssetKey, path: string): Promise<ToolReply | SavedAt> => {
  const also = await savedDependencies(context, documentId, { keys: [key] }, parentOf(path));
  if ('outcome' in also) return also;
  const copied = await copyAssetTo(context, documentId, key, path);
  return typeof copied === 'string' ? { path: copied, also } : copied;
};

const movedTo = async (context: ToolContext, documentId: DocumentId, key: AssetKey, path: string): Promise<ToolReply | SavedAt> => {
  adoptPath(context.host, documentId, key, toSlashes(path));
  const also = await savedDependencies(context, documentId, { keys: [key] }, parentOf(path));
  if ('outcome' in also) return also;
  const outcome = await saveTab(toolKit(context), tabOf(documentId, key), true);
  if (outcome.kind === 'done') return { path: outcome.path, also };
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(outcome.kind === 'failed' ? outcome.message : ''), { path: 'target' }));
};

const saveAssetAt = async (context: ToolContext, documentId: DocumentId, path: string, save: SaveInput): Promise<ToolReply | SavedAt> => {
  const key = assetFor(context, documentId, path, save.asset);
  if (!key) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.noAssetOfKind, { path: 'target' }));
  const hasFile = useWorkspaceStore.getState().workspaces[documentId]?.paths.has(key.id) ?? false;
  const denied = checkAssetSave(context, documentId, key, { path, moving: hasFile && moves(save.target) });
  if (denied) return reply(denied);
  return hasFile && !moves(save.target) ? copiedTo(context, documentId, key, path) : movedTo(context, documentId, key, path);
};

export { saveAssetAt };
