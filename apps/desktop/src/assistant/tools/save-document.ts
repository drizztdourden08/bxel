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
import { hiddenAssets } from './hidden-assets';
import { placeOf } from './place-of';
import { reply } from './reply';
import { saveAssetAt } from './save-asset-at';
import { saveOneAsset } from './save-one-asset';
import { queuedSave } from './save-queue';
import { savedDependencies } from './saved-dependencies';
import { saveVisible } from './save-visible';
import type { SaveInput, SavedAt } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';
import { viewFor } from './view-for';
import { writePlace } from './write-place';

const saveInPlace = async (context: ToolContext, documentId: DocumentId): Promise<ToolReply | SavedAt> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const view = context.host.view(documentId);
  if (!workspace || !view) return reply(hiddenFailure('document'));
  const live = dirtyKeys(workspace, view.state.artwork).live;
  const also = await savedDependencies(context, documentId, { keys: live }, null);
  if ('outcome' in also) return also;
  const hidden = hiddenAssets(context, documentId);
  const dirty = dirtyKeys(useWorkspaceStore.getState().workspaces[documentId] ?? workspace, view.state.artwork);
  if ([...dirty.live, ...dirty.gone].some((key) => hidden.has(key.id))) {
    const visible = await saveVisible(context, documentId, hidden);
    return typeof visible === 'string' ? { path: visible, also } : visible;
  }
  const outcome = await saveWorkspace(toolKit(context), documentId);
  if (outcome.kind === 'done') return { path: outcome.path, also };
  return reply(mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, outcome.kind === 'failed' ? outcome.message : TOOL_TEXT.noTarget));
};

const written = async (context: ToolContext, documentId: DocumentId, save: SaveInput, place: string): Promise<ToolReply | SavedAt> => {
  if (save.target !== 'current') return saveAssetAt(context, documentId, place, save);
  return save.asset ? saveOneAsset(context, documentId, save.asset) : saveInPlace(context, documentId);
};

const refusal = (context: ToolContext, save: SaveInput, view: NonNullable<ReturnType<typeof viewFor>>): ToolReply | null => {
  const stale = checkRevision(view, save.expectedRevision);
  const denied = save.target === 'current' ? checkSaveAccess(context, save.documentId as DocumentId) : null;
  const failure = stale ?? denied;
  return failure ? reply(failure) : null;
};

const saveNow = async (context: ToolContext, save: SaveInput): Promise<ToolReply> => {
  const view = viewFor(context, save.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const refused = refusal(context, save, view);
  if (refused) return refused;
  const documentId = save.documentId as DocumentId;
  const place = await writePlace(context, save);
  if (!place.ok) return reply(place);
  const result = await written(context, documentId, save, place.value);
  if ('outcome' in result) return result;
  const shown = save.target === 'current' ? result.path : place.value;
  const bytes = await context.documents.read(shown).then((data) => data.length, () => 0);
  return reply({
    ok: true,
    revision: context.host.view(documentId)?.state.revision ?? view.state.revision,
    fileName: fileName(shown),
    place: placeOf(context, shown),
    bytes,
    savedAt: new Date().toISOString(),
    asset: save.asset ?? null,
    ...(result.also.length > 0 ? { alsoSaved: result.also } : {}),
  });
};

const saveDocument: ToolHandler = (input, context) => queuedSave(() => saveNow(context, input as SaveInput));

export { saveDocument };
