/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { dirtyKeys } from '../../workspace/dirty-keys';
import { saveWorkspace } from '../../workspace/save-workspace';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { checkRevision } from './check-revision';
import { checkSaveAccess } from './check-save-access';
import { placeOf } from './place-of';
import { reply } from './reply';
import { saveAssetAt } from './save-asset-at';
import { saveOneAsset } from './save-one-asset';
import type { SaveInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';
import { viewFor } from './view-for';
import { writePlace } from './write-place';

const saveInPlace = async (context: ToolContext, documentId: DocumentId): Promise<ToolReply | string> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = context.host.view(documentId);
  if (!workspace || !view) return reply(hiddenFailure('document'));
  if (dirtyKeys(workspace, view.state.artwork).live.some((key) => !workspace.paths.has(key.id))) {
    return reply(mcpFailure(MCP_ERROR_CODE.NEEDS_FILE_NAME, TOOL_TEXT.needsName, { path: 'target' }));
  }
  const outcome = await saveWorkspace(toolKit(context), documentId);
  return outcome.kind === 'done' ? outcome.path : reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, outcome.kind === 'failed' ? outcome.message : TOOL_TEXT.noTarget));
};

const written = async (context: ToolContext, documentId: DocumentId, save: SaveInput, place: string): Promise<ToolReply | string> => {
  if (save.target !== 'current') return saveAssetAt(context, documentId, place, save);
  return save.asset ? saveOneAsset(context, documentId, save.asset) : saveInPlace(context, documentId);
};

const refusal = (context: ToolContext, save: SaveInput, view: NonNullable<ReturnType<typeof viewFor>>): ToolReply | null => {
  const stale = checkRevision(view, save.expectedRevision);
  const denied = save.target === 'current' ? checkSaveAccess(context, save.documentId as DocumentId) : null;
  const failure = stale ?? denied;
  return failure ? reply(failure) : null;
};

const saveDocument: ToolHandler = async (input, context) => {
  const save = input as SaveInput;
  const view = viewFor(context, save.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const refused = refusal(context, save, view);
  if (refused) return refused;
  const documentId = save.documentId as DocumentId;
  const place = await writePlace(context, save);
  if (!place.ok) return reply(place);
  const result = await written(context, documentId, save, place.value);
  if (typeof result !== 'string') return result;
  const shown = save.target === 'current' ? result : place.value;
  const bytes = await context.documents.read(shown).then((data) => data.length, () => 0);
  return reply({
    ok: true,
    revision: context.host.view(documentId)?.state.revision ?? view.state.revision,
    fileName: fileName(shown),
    place: placeOf(context, shown),
    bytes,
    savedAt: new Date().toISOString(),
    asset: save.asset ?? null,
  });
};

export { saveDocument };
