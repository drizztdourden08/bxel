/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { assetKeys } from '../../workspace/asset-keys';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import { savedDependencies } from './saved-dependencies';
import type { AssetInput, SavedAt } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const saveOneAsset = async (context: ToolContext, documentId: DocumentId, asset: AssetInput): Promise<ToolReply | SavedAt> => {
  const artwork = context.host.view(documentId)?.state.artwork;
  const hidden = hiddenAssets(context, documentId);
  const key = artwork ? assetKeys(artwork).find((each) => each.kind === asset.kind && each.id === asset.id && !hidden.has(each.id)) : undefined;
  if (!key) return reply(hiddenFailure('document'));
  const also = await savedDependencies(context, documentId, { keys: [key], named: [key] }, null);
  if ('outcome' in also) return also;
  const outcome = await saveTab(toolKit(context), tabOf(documentId, key), false);
  if (outcome.kind === 'done') return { path: outcome.path, also };
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, outcome.kind === 'failed' ? outcome.message : TOOL_TEXT.noTarget));
};

export { saveOneAsset };
