/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { useAssistantStore } from '../../stores/useAssistantStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import type { ToolContext } from '../assistant.type';
import { decodeAt } from './decode-at';
import { loadRecent } from './load-recent';
import { reply } from './reply';
import type { OpenTarget } from './tool-input.type';

const opened = (context: ToolContext, documentId: DocumentId, path: string, alreadyOpen: boolean): ToolReply => {
  const view = context.host.view(documentId);
  return reply({
    ok: true,
    documentId,
    revision: view?.state.revision ?? 1,
    alreadyOpen,
    readOnly: view?.state.readOnly ?? false,
    outcome: view?.state.readOnly ? 'recoverable' : 'ok',
    fileName: fileName(path),
  });
};

const openTarget = async (context: ToolContext, target: OpenTarget, activate: boolean): Promise<ToolReply> => {
  const existing = context.paths.documentAt(target.path);
  if (existing !== undefined) return opened(context, existing, target.path, true);
  const loaded = target.viaRecent ? await loadRecent(context.documents, target.path) : await decodeAt(context.documents, target.path);
  if (!loaded.ok) return reply(loaded);
  const { report, path } = loaded.value;
  if (report.artwork === null) return reply(hiddenFailure('file'));
  const documentId = context.host.open({ artwork: report.artwork, readOnly: report.readOnly });
  context.paths.remember(documentId, path);
  useAssistantStore.getState().markOpened(documentId);
  if (activate) useDocumentStore.getState().setActive(documentId);
  return opened(context, documentId, path, false);
};

export { openTarget };
