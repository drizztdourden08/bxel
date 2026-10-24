/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { reasonOf } from '../../files/reason-of';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { assetPreview } from '../../workspace/asset-preview';
import { encodeAsset } from '../../workspace/encode-asset';
import { toSlashes } from '../../workspace/to-slashes';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';

const copyAssetTo = async (context: ToolContext, documentId: DocumentId, key: AssetKey, path: string): Promise<ToolReply | string> => {
  const artwork = context.host.view(documentId)?.state.artwork;
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  if (!artwork || !workspace) return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_FILE_NAME, TOOL_TEXT.needsName, { path: 'target' }));
  try {
    const paths = new Map(workspace.paths).set(key.id, toSlashes(path));
    const bytes = encodeAsset(artwork, key, paths, { preview: assetPreview(artwork, key), clock: () => Date.now() });
    await context.documents.write(path, bytes, { recent: false });
    return path;
  } catch (error) {
    return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(reasonOf(error)), { path: 'target' }));
  }
};

export { copyAssetTo };
