/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { dirtyKeys } from '../../workspace/dirty-keys';
import { saveWorkspace } from '../../workspace/save-workspace';
import type { ToolHandler } from '../assistant.type';
import { checkRevision } from './check-revision';
import { placeOf } from './place-of';
import { reply } from './reply';
import { saveAssetAt } from './save-asset-at';
import type { SaveInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';
import { viewFor } from './view-for';
import { writePlace } from './write-place';

const saveInPlace = async (context: Parameters<ToolHandler>[1], documentId: DocumentId): Promise<ToolReply | string> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = context.host.view(documentId);
  if (!workspace || !view) return reply(hiddenFailure('document'));
  if (dirtyKeys(workspace, view.state.artwork).live.some((key) => !workspace.paths.has(key.id))) {
    return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_FILE_NAME, TOOL_TEXT.needsName, { path: 'target' }));
  }
  const outcome = await saveWorkspace(toolKit(context), documentId);
  return outcome.kind === 'done' ? outcome.path : reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, outcome.kind === 'failed' ? outcome.message : TOOL_TEXT.noTarget));
};

const saveDocument: ToolHandler = async (input, context) => {
  const save = input as SaveInput;
  const view = viewFor(context, save.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, save.expectedRevision);
  if (stale) return reply(stale);
  const place = await writePlace(context, save);
  if (!place.ok) return reply(place);
  const documentId = save.documentId as DocumentId;
  const written = save.target === 'current' ? await saveInPlace(context, documentId) : await saveAssetAt(context, documentId, place.value);
  if (typeof written !== 'string') return written;
  const shown = save.target === 'current' ? written : place.value;
  const bytes = await context.documents.read(shown).then((data) => data.length, () => 0);
  return reply({
    ok: true,
    revision: context.host.view(documentId)?.state.revision ?? view.state.revision,
    fileName: fileName(shown),
    place: placeOf(context, shown),
    bytes,
    savedAt: new Date().toISOString(),
  });
};

export { saveDocument };
