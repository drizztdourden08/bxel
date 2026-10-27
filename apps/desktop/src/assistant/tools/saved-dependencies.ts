/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { reasonOf } from '../../files/reason-of';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { writeAssets } from '../../workspace/write-assets';
import type { ToolContext } from '../assistant.type';
import { placeDependencies } from './place-dependencies';
import type { Roots } from './place-dependencies.type';
import { reply } from './reply';
import type { AlsoSaved } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const listed = (documentId: DocumentId, keys: readonly AssetKey[]): readonly AlsoSaved[] => {
  const paths = useWorkspaceStore.getState().workspaces[documentId]?.paths;
  return keys.flatMap((key) => {
    const path = paths?.get(key.id);
    return path === undefined || key.kind === 'project' ? [] : [{ fileName: fileName(path), asset: { kind: key.kind, id: key.id } }];
  });
};

const savedDependencies = async (
  context: ToolContext,
  documentId: DocumentId,
  roots: Roots,
  dir: string | null,
): Promise<ToolReply | readonly AlsoSaved[]> => {
  const placed = await placeDependencies(context, documentId, roots, dir);
  if (!placed.ok) return reply(placed);
  if (placed.value.length === 0) return [];
  try {
    await writeAssets(toolKit(context), documentId, placed.value);
  } catch (error) {
    return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(reasonOf(error)), { path: 'target' }));
  }
  return listed(documentId, placed.value);
};

export { savedDependencies };
