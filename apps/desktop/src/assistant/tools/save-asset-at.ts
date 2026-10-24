/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { entryKindOf } from '@bxel/project';
import { fileName } from '../../files/file-name';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { adoptPath } from '../../workspace/adopt-path';
import { assetKeys } from '../../workspace/asset-keys';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import { toSlashes } from '../../workspace/to-slashes';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const assetFor = (context: ToolContext, documentId: DocumentId, path: string): AssetKey | null => {
  const kind = entryKindOf(fileName(path));
  const artwork = context.host.view(documentId)?.state.artwork;
  const keys = artwork ? assetKeys(artwork).filter((key) => key.kind === kind) : [];
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const active = tabs.find((tab) => tab.id === activeTab && tab.documentId === documentId)?.key;
  return keys.find((key) => key.id === active?.id) ?? keys[0] ?? null;
};

const saveAssetAt = async (context: ToolContext, documentId: DocumentId, path: string): Promise<ToolReply | string> => {
  const key = assetFor(context, documentId, path);
  if (!key) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.noAssetOfKind, { path: 'target' }));
  adoptPath(context.host, documentId, key, toSlashes(path));
  const outcome = await saveTab(toolKit(context), tabOf(documentId, key), true);
  if (outcome.kind === 'done') return outcome.path;
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(outcome.kind === 'failed' ? outcome.message : ''), { path: 'target' }));
};

export { saveAssetAt };
