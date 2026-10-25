/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { dirtyKeys } from '../../workspace/dirty-keys';
import { settleEngine } from '../../workspace/settle-engine';
import { writeAssets } from '../../workspace/write-assets';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';
import { toolKit } from './tool-kit';

const saveVisible = async (context: ToolContext, documentId: DocumentId, hidden: ReadonlySet<string>): Promise<ToolReply | string> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = context.host.view(documentId);
  if (!workspace || !view) return reply(hiddenFailure('document'));
  const keys = dirtyKeys(workspace, view.state.artwork).live.filter((key) => !hidden.has(key.id));
  const written = await writeAssets(toolKit(context), documentId, keys);
  settleEngine(context.host, documentId);
  return workspace.projectFile ?? written[0]?.path ?? '';
};

export { saveVisible };
