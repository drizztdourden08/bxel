/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { assetKeys } from '../../workspace/asset-keys';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import type { AssetInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const saveOneAsset = async (context: ToolContext, documentId: DocumentId, asset: AssetInput): Promise<ToolReply | string> => {
  const artwork = context.host.view(documentId)?.state.artwork;
  const hidden = hiddenAssets(context, documentId);
  const key = artwork ? assetKeys(artwork).find((each) => each.kind === asset.kind && each.id === asset.id && !hidden.has(each.id)) : undefined;
  if (!key) return reply(hiddenFailure('document'));
  if (!useWorkspaceStore.getState().workspaces[documentId]?.paths.has(key.id)) {
    return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_FILE_NAME, TOOL_TEXT.needsName, { path: 'asset' }));
  }
  const outcome = await saveTab(toolKit(context), tabOf(documentId, key), false);
  if (outcome.kind === 'done') return outcome.path;
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, outcome.kind === 'failed' ? outcome.message : TOOL_TEXT.noTarget));
};

export { saveOneAsset };
